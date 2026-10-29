import { requireUser } from "@/lib/auth";
import { ZendoError, fail, readBody } from "@/lib/errors";
import { L1Client } from "@/lib/l1/client";
import { relay } from "@/lib/l1/settlement";
import { assertSenderMatchesAddress, verifyL1Tx } from "@/lib/l1/verify";

export const dynamic = "force-dynamic";

/**
 * The settlement boundary. The client signs with the key it derives from its own recovery phrase and
 * posts the signed transaction here; this route verifies the signature and relays it to the zendo-1
 * node, then waits for block inclusion and finality. It never writes to the app database, and it
 * never reports success until the chain has confirmed the transaction.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await readBody(req);
    const tx = verifyL1Tx(body.tx);
    if (!user.l1Address) throw new ZendoError("This account has no native signing address.", 403, "signature");
    assertSenderMatchesAddress(tx, user.l1Address);
    const client = L1Client.fromEnv();
    const [nonce, balance] = await Promise.all([client.nonce(user.l1Address), client.balance(user.l1Address)]);
    if (tx.nonce !== nonce) throw new ZendoError("The transaction nonce is stale. Refresh and sign again.", 409, "signature");
    if (BigInt(tx.amount) + BigInt(tx.fee) > BigInt(balance)) {
      throw new ZendoError("Insufficient native balance for amount plus network fee.", 400, "insufficient");
    }
    const settled = await relay(client, tx, { timeoutMs: 20_000 });
    return Response.json({ ok: true, id: settled.id, height: settled.height, finalized: settled.finalized });
  } catch (error) {
    if (error instanceof ZendoError) return fail(error);
    const message = error instanceof Error ? error.message : "The zendo-1 node is not reachable.";
    return fail(new ZendoError(message, 502));
  }
}
