import { requireUser } from "@/lib/auth";
import { coins, createCoin } from "@/lib/engine";
import { fail, readBody } from "@/lib/errors";
import { CREATE_FEE_UNITS, L1Client, launchCreate } from "@/lib/l1/index";
import { verifyL1Tx } from "@/lib/l1/verify";
import { settleRoute } from "@/lib/l1/settle-route";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  try {
    return Response.json(await coins(url.searchParams.get("sort") || "trending", url.searchParams.get("q") || ""));
  } catch (error) {
    return fail(error);
  }
}

/**
 * A launchpad create is an L1 state change: it charges the flat 0.2 Z creation fee into the treasury
 * and stores the curve program on the chain. The client signs the deploy transaction; the server
 * relays it and mirrors the confirmed coin into the read model.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await readBody(req);
    const program = await L1Client.fromEnv().launchProgram();
    if (body.tx !== undefined && body.tx !== null) {
      const tx = verifyL1Tx(body.tx);
      const expected = launchCreate(program);
      if (tx.to !== expected.to || tx.amount !== expected.amount.toString() || tx.data.toLowerCase() !== expected.data?.toString("hex")) {
        throw new Error("The signed transaction does not match this coin launch.");
      }
      if (BigInt(tx.fee) <= 0n) throw new Error("The signed launch transaction must include a network fee.");
    }
    let mirroredCoin: Awaited<ReturnType<typeof createCoin>> | null = null;
    const settled = await settleRoute({
      userId: user.id,
      tx: body.tx,
      fee: 200_000n,
      build: async () => launchCreate(program),
      mirror: async () => {
        mirroredCoin = await createCoin(user.id, body);
        return mirroredCoin;
      },
    });
    return Response.json({ ok: true, id: settled.id, height: settled.height, finalized: settled.finalized, mirrored: settled.mirrored, fee: CREATE_FEE_UNITS.toString(), coin: mirroredCoin });
  } catch (error) {
    return fail(error);
  }
}
