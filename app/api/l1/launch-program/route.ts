import { requireUser } from "@/lib/auth";
import { fail } from "@/lib/errors";
import { L1Client } from "@/lib/l1/client";

export const dynamic = "force-dynamic";

/** The launch program is public chain data required to build a client-signed create transaction. */
export async function GET() {
  try {
    const user = await requireUser();
    if (!user.l1Address) throw new Error("This account has no native signing address.");
    const program = await L1Client.fromEnv().launchProgram();
    const clean = typeof program === "string" ? program.replace(/^0x/, "") : "";
    if (!/^([0-9a-fA-F]{2})+$/.test(clean)) throw new Error("The node returned an invalid launch program.");
    return Response.json({ program: clean });
  } catch (error) {
    return fail(error, "l1.launch-program");
  }
}
