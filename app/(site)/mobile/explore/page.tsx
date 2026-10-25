"use client";

import Link from "next/link";
import { ArrowDownUp, ArrowLeftRight, Blocks, Coins, Landmark, Rocket, ShieldCheck, Users, Vote, Wallet } from "lucide-react";
import { useSyncExternalStore } from "react";

const modules = [
  ["Wallet", "/mobile/wallet", Wallet, "View your account, balances, and activity."],
  ["Send & Receive", "/mobile/send", ArrowDownUp, "Prepare a signed transfer or copy your wallet address."],
  ["Launchpad", "/launchpad", Rocket, "Review live launch data and token details."],
  ["ZendoCoin", "/zcoin", Coins, "Understand the native asset and its network role."],
  ["Bridge", "/mobile/bridge", ArrowLeftRight, "Bridge actions require confirmed external events."],
  ["Staking", "/mobile/stake", Landmark, "Validators, delegation, and rewards."],
  ["Governance", "/governance", Vote, "Read proposals and vote when eligible."],
  ["Marketplace", "/market", ShieldCheck, "Browse available marketplace listings."],
  ["Explorer", "/explorer", Blocks, "Inspect blocks, transactions, and validators."],
  ["Social", "/mobile/social", Users, "Community activity and profiles."],
] as const;

const androidModuleGroups = [
  {
    title: "Wallet",
    modules: [
      ["Wallet", "/mobile/wallet", Wallet, "Balances, activity, and account tools."],
      ["Send & Receive", "/mobile/send", ArrowDownUp, "Transfer ZCoin or share your address."],
      ["Bridge", "/mobile/bridge", ArrowLeftRight, "Move assets when bridge service is available."],
    ],
  },
  { title: "Earn", modules: [["Staking", "/mobile/stake", Landmark, "Validators, delegation, and rewards."]] },
  {
    title: "Create",
    modules: [
      ["Launchpad", "/launchpad", Rocket, "Explore token launches and their details."],
      ["ZendoCoin", "/zcoin", Coins, "Learn about the network’s native asset."],
    ],
  },
  { title: "Govern", modules: [["Governance", "/governance", Vote, "Read proposals and vote when eligible."]] },
  {
    title: "Discover",
    modules: [
      ["Explorer", "/explorer", Blocks, "Inspect blocks, transactions, and validators."],
      ["Marketplace", "/market", ShieldCheck, "Browse available marketplace listings."],
      ["Social", "/mobile/social", Users, "Community activity and profiles."],
    ],
  },
] as const;

export default function MobileExplorePage() {
  const androidMode = useSyncExternalStore(
    () => () => {},
    () => document.documentElement.dataset.zendoApp === "android",
    () => false,
  );

  if (!androidMode) {
    return <main className="zendo-mobile-home zendo-mobile-explore"><header className="zendo-mobile-app-header"><Link href="/mobile" className="zendo-mobile-wordmark">ZENDO</Link><Link href="/mobile/profile" className="zendo-mobile-header-link">Account</Link></header><p className="zendo-mobile-eyebrow">ECOSYSTEM</p><h1>Explore Zendo</h1><p className="zendo-mobile-copy">Open the Zendo tools available in this investor demo. Network-dependent actions clearly show when a required live service is unavailable.</p><section className="zendo-mobile-grid">{modules.map(([title, href, Icon, detail]) => <Link key={title} href={href} className="zendo-mobile-card"><Icon/><strong>{title}</strong><span>{detail}</span></Link>)}</section></main>;
  }

  return (
    <main className="zendo-mobile-home zendo-mobile-explore">
      <header className="zendo-mobile-app-header"><Link href="/mobile" className="zendo-mobile-wordmark">ZENDO</Link><Link href="/mobile/profile" className="zendo-mobile-header-link">Account</Link></header>
      <p className="zendo-mobile-eyebrow">ECOSYSTEM</p>
      <h1>Explore Zendo</h1>
      <p className="zendo-mobile-copy">Access the Zendo ecosystem from one place.</p>
      <div className="zendo-mobile-explore-groups">
        {androidModuleGroups.map(({ title, modules }) => (
          <section key={title} className="zendo-mobile-explore-group" aria-labelledby={`explore-${title.toLowerCase()}`}>
            <h2 id={`explore-${title.toLowerCase()}`}>{title}</h2>
            <div className="zendo-mobile-grid">
              {modules.map(([name, href, Icon, detail]) => <Link key={name} href={href} className="zendo-mobile-card"><Icon/><strong>{name}</strong><span>{detail}</span></Link>)}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
