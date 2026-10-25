"use client";

import { useEffect, useState } from "react";
import { AppFrame, BridgeDesk, SendForm, SettingsForm, StakeDesk, SupportDesk, WalletHome } from "./app-views";
import { SocialDesk } from "./social";
import { api } from "@/lib/sdk";
import type { PublicUser } from "@/lib/types";
import { LoadingPanel } from "./ui";

type Destination = "wallet" | "profile" | "send" | "bridge" | "stake" | "social" | "support";

const destinationPath: Record<Destination, string> = {
  wallet: "/mobile/wallet",
  profile: "/mobile/profile",
  send: "/mobile/send",
  bridge: "/mobile/bridge",
  stake: "/mobile/stake",
  social: "/mobile/social",
  support: "/mobile/support",
};

function DestinationContent({ destination, user }: { destination: Destination; user: PublicUser }) {
  if (destination === "wallet") return <WalletHome />;
  if (destination === "profile") return <SettingsForm user={user} mobile />;
  if (destination === "send") return <><h1 className="zendo-mb-4 zendo-font-display zendo-text-4xl zendo-font-bold">Send</h1><SendForm /></>;
  if (destination === "bridge") return <><h1 className="zendo-mb-2 zendo-font-display zendo-text-4xl zendo-font-bold">Bridge</h1><BridgeDesk /></>;
  if (destination === "stake") return <><h1 className="zendo-mb-2 zendo-font-display zendo-text-4xl zendo-font-bold">Stake</h1><StakeDesk /></>;
  if (destination === "social") return <><h1 className="zendo-mb-2 zendo-font-display zendo-text-4xl zendo-font-bold">Social</h1><SocialDesk /></>;
  return <><h1 className="zendo-mb-2 zendo-font-display zendo-text-4xl zendo-font-bold">Support tickets</h1><SupportDesk /></>;
}

/** Local Android documents obtain authentication from the real HTTPS API. */
export function MobileAuthPage({ destination }: { destination: Destination }) {
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    api<{ user: PublicUser | null }>("/api/auth/me")
      .then((result) => { if (active) setUser(result.user); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user !== null) return;
    window.location.replace(`/signin?next=${encodeURIComponent(destinationPath[destination])}&zendo_app=android`);
  }, [destination, user]);

  if (user === undefined || user === null) return <LoadingPanel label="Opening your Zendo account" />;
  return <AppFrame user={user}><DestinationContent destination={destination} user={user} /></AppFrame>;
}
