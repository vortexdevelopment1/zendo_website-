import { requireUser } from "@/lib/auth";
import { send } from "@/lib/engine";
import { fail, readBody, ZendoError } from "@/lib/errors";
import { transfer, zToUnits } from "@/lib/l1/index";
import { settleRoute } from "@/lib/l1/settle-route";
import { assertSenderMatchesAddress, verifyL1Tx } from "@/lib/l1/verify";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Native transfers settle on zendo-1. The client signs the transaction with its own recovery-phrase
 * key and posts it as `tx`; the server verifies and relays it, then mirrors the confirmed result into
 * the read model. Nothing is reported as sent until the chain finalizes it.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await readBody(req);
    const to = String(body.to ?? "");
    const amount = String(body.amount ?? "");
    const token = body.token === undefined ? "ZCOIN" : String(body.token);
    const recipient = to.trim().replace(/^0x/, "").toLowerCase();
    if (!/^[0-9a-f]{40}$/.test(recipient)) throw new ZendoError("Enter a 20-byte native Zendo address in hexadecimal.", 400, "malformed");
    if (token.toUpperCase() !== "ZCOIN") throw new ZendoError("Native Send currently supports ZCOIN only.", 400, "malformed");
    let amountUnits: bigint;
    try {
      amountUnits = zToUnits(amount);
    } catch {
      throw new ZendoError("Enter a valid positive ZCOIN amount.", 400, "malformed");
    }
    if (amountUnits <= 0n) throw new ZendoError("Enter an amount greater than zero.", 400, "malformed");
    const feeUnits = zToUnits(getConfig().gas.transfer);
    if (body.tx !== undefined && body.tx !== null) {
      const signed = verifyL1Tx(body.tx);
      if (!user.l1Address) throw new ZendoError("This account has no native signing address.", 403, "signature");
      assertSenderMatchesAddress(signed, user.l1Address);
      if (signed.to !== recipient || signed.amount !== amountUnits.toString() || signed.fee !== feeUnits.toString() || signed.data !== "") {
        throw new ZendoError("The signed transaction does not match this Send request.", 400, "signature");
      }
    }
    const settled = await settleRoute({
      userId: user.id,
      tx: body.tx,
      build: () => transfer(recipient, amountUnits),
      mirror: () => send(user.id, recipient, token, amount),
    });
    return Response.json({ ok: true, id: settled.id, height: settled.height, finalized: settled.finalized, mirrored: settled.mirrored });
  } catch (error) {
    return fail(error);
  }
}
