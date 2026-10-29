import { ZendoError } from "../errors";
import { logEvent } from "../log";
import { L1Client } from "./client";
import { custodialSigningAllowed, signerForUser } from "./config";
import type { TxInput } from "./operations";
import { relay, settle, type Settled } from "./settlement";
import { assertSenderMatchesAddress, verifyL1Tx } from "./verify";
import { reconcileFromL1Internal, userById } from "../engine";

export type SettleRouteInput = {
  userId: string;
  /** The client-signed transaction. In production this is required. */
  tx: unknown;
  /** Builds the operation for the DEV/TEST server-signed fallback only. */
  build: () => TxInput | Promise<TxInput>;
  fee?: bigint;
  /** Optional read-model mirror, run only after the chain has finalized. */
  mirror?: () => unknown | Promise<unknown>;
  timeoutMs?: number;
};

export type SettledRoute = Settled & { mirrored: boolean };

/**
 * The one path every financial API route goes through. It prefers a client-signed transaction (the
 * signature is the authorization), falls back to the DEV/TEST server signer only when explicitly
 * allowed, and refuses otherwise. The read-model mirror runs only after finality, and a mirror
 * failure is logged but never turns a confirmed chain result into a client error.
 */
export async function settleRoute(input: SettleRouteInput): Promise<SettledRoute> {
  const client = L1Client.fromEnv();
  const timeoutMs = input.timeoutMs ?? 20_000;

  let settled: Settled;
  if (input.tx !== undefined && input.tx !== null) {
    const tx = verifyL1Tx(input.tx);
    const user = await userById(input.userId);
    if (!user?.l1Address) throw new ZendoError("This account has no native signing address.", 403, "signature");
    assertSenderMatchesAddress(tx, user.l1Address);
    const [nonce, balance] = await Promise.all([client.nonce(user.l1Address), client.balance(user.l1Address)]);
    if (tx.nonce !== nonce) throw new ZendoError("The transaction nonce is stale. Refresh and sign again.", 409, "signature");
    if (BigInt(tx.amount) + BigInt(tx.fee) > BigInt(balance)) {
      throw new ZendoError("Insufficient native balance for amount plus network fee.", 400, "insufficient");
    }
    settled = await relay(client, tx, { timeoutMs });
  } else if (custodialSigningAllowed()) {
    const identity = signerForUser(input.userId);
    settled = await settle(client, identity, await input.build(), { fee: input.fee ?? 10_000n, timeoutMs });
  } else {
    throw new ZendoError("Sign this transaction on your device and post the signed L1 transaction.", 401, "signature");
  }

  let mirrored = false;
  if (input.mirror) {
    try {
      // Refresh the projection from finalized L1 state before mirroring the route-specific record.
      // This is server-internal; no client-supplied balance or public reconciliation endpoint is used.
      await reconcileFromL1Internal();
      await input.mirror();
      mirrored = true;
    } catch (error) {
      logEvent("read_model_mirror_failed", {
        id: settled.id,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
  }
  return { ...settled, mirrored };
}
