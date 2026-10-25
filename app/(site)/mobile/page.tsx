"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Blocks, Landmark, Rocket, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, LoadingPanel, Panel } from "@/components/ui";
import { api } from "@/lib/sdk";
import type { PublicUser } from "@/lib/types";

const explore = [
  ["Launchpad", "/launchpad", Rocket, "Discover existing token launches"],
  ["Staking", "/mobile/stake", Landmark, "Validators and delegation"],
  ["Governance", "/governance", ShieldCheck, "Proposals and voting"],
  ["Explorer", "/explorer", Blocks, "Blocks, transactions and validators"],
] as const;

function AppHeader({ signedIn }: { signedIn: boolean }) {
  return <header className="zendo-mobile-app-header"><Link href="/mobile" className="zendo-mobile-wordmark">ZENDO</Link><Link href={signedIn ? "/mobile/profile" : "/signin?next=%2Fmobile%2Fprofile"} className="zendo-mobile-header-link">{signedIn ? "Account" : "Sign in"}</Link></header>;
}

export default function MobileHome() {
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);
  useEffect(() => {
    let active = true;
    api<{ user: PublicUser | null }>("/api/auth/me").then((result) => {
      if (active) setUser(result.user);
    }).catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  if (user === undefined) return <LoadingPanel label="Opening Zendo" />;
  if (!user) return <main className="zendo-mobile-home"><AppHeader signedIn={false}/><p className="zendo-mobile-eyebrow">ZENDO APP</p><h1>Your wallet, your keys.</h1><p className="zendo-mobile-copy">A focused mobile gateway to the Zendo ecosystem. Create an account to use wallet and profile features.</p><div className="zendo-mobile-actions"><Button asChild><Link href="/signup">Create account</Link></Button><Button asChild variant="outline"><Link href="/signin">Log in</Link></Button></div><section className="zendo-mobile-grid">{explore.map(([title, href, Icon, detail]) => <Link key={title} href={href} className="zendo-mobile-card"><Icon/><strong>{title}</strong><span>{detail}</span></Link>)}</section></main>;
  return <main className="zendo-mobile-home"><AppHeader signedIn/><div className="zendo-mobile-top"><div><p className="zendo-mobile-eyebrow">WELCOME BACK</p><h1>{user.displayName}</h1></div><Link href="/mobile/profile" aria-label="Profile"><ShieldCheck/></Link></div><Panel className="zendo-mobile-balance"><p>Total portfolio</p><strong>Open Wallet</strong><span>Balances are shown only from your authenticated account.</span><div><Button asChild><Link href="/mobile/send"><ArrowUpRight/> Send</Link></Button><Button asChild variant="outline"><Link href="/mobile/wallet"><ArrowDownLeft/> Receive</Link></Button></div></Panel><section><div className="zendo-mobile-section-title"><h2>Explore Zendo</h2><Link href="/mobile/explore">View all</Link></div><div className="zendo-mobile-grid">{explore.map(([title, href, Icon, detail]) => <Link key={title} href={href} className="zendo-mobile-card"><Icon/><strong>{title}</strong><span>{detail}</span></Link>)}</div></section></main>;
}
