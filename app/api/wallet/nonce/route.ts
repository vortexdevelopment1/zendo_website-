import { requireUser } from "@/lib/auth";
import { fail } from "@/lib/errors";
import { L1Client } from "@/lib/l1/client";
import { unitsToZ, zToUnits } from "@/lib/l1/units";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/** Returns the current user's authoritative native nonce and transfer fee. */
export async function GET() {
  try {
    const user = await requireUser();
    if (!user.l1Address) throw new Error("This account has no native signing address.");
    const client = L1Client.fromEnv();
    const [nonce, balance] = await Promise.all([client.nonce(user.l1Address), client.balance(user.l1Address)]);
    if (!Number.isSafeInteger(nonce) || nonce < 0) throw new Error("The node returned an invalid nonce.");
    if (!/^[0-9]+$/.test(String(balance))) throw new Error("The node returned an invalid balance.");
    const fee = zToUnits(getConfig().gas.transfer);
    return Response.json({ address: user.l1Address, nonce, balance: String(balance), fee: fee.toString(), feeZ: unitsToZ(fee) });
  } catch (error) {
    return fail(error, "wallet.nonce");
  }
}
