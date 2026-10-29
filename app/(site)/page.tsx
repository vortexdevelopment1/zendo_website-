import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeftRight, CircleDollarSign, Rocket, Target, Users } from "lucide-react";
import { home } from "@/lib/engine";
import { Button } from "@/components/ui";
import { PriceChart } from "@/components/chrome";
import { ZendoL1ZipLink } from "@/components/zendo-l1-zip";
import { ZendoCoinZipLink } from "@/components/zendocoin-zip";
import { LaunchpadArt, StudioArt, ExplorerCubeArt, ZCoinArt } from "@/components/reference-art";

export const dynamic = "force-dynamic";

const ecosystemCards: [ReactNode, string, string, string][] = [
  ["launch", "Meme Coin Launchpad", "Create and launch your token in seconds.", "/launchpad"],
  ["studio", "Developer Studio", "Compile and deploy smart contracts.", "/developers"],
  ["explorer", "Zendo Explorer", "Real-time blockchain data.", "/explorer"],
  ["zcoin", "ZCoin Ecosystem", "Powering the Zendo economy.", "/zcoin"],
];

export default async function HomePage() {
  const data = await home();
  return (
    <div className="zendo-homepage-shell">
      <div className="zendo-home-reference-panel">
      <section className="zendo-approved-hero zendo-site-container zendo-home-hero zendo-grid zendo-lg:zendo-grid-cols-[0.78fr_1.22fr] zendo-lg:zendo-items-center">
        <div className="zendo-home-hero-copy">

          <p className="zendo-mt-6 zendo-text-xs zendo-font-semibold zendo-uppercase zendo-tracking-[0.18em] zendo-text-lime">Zendo L-1</p>
          <h1 className="zendo-home-heading zendo-mt-4 zendo-font-display zendo-font-bold zendo-tracking-tight">Build. Launch. <span className="zendo-text-lime">Trade. Grow.</span></h1>
          <p className="zendo-mt-5 zendo-max-w-xl zendo-text-lg zendo-leading-8 zendo-text-muted">
            The fastest, most advanced sovereign L-1 blockchain for creators, developers and the next generation of web3.
          </p>
          <div className="zendo-home-actions zendo-mt-8">
            <div className="zendo-flex zendo-flex-wrap zendo-gap-3">
            <Button size="lg" asChild><Link href="/launchpad/create">Launch a Coin</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/developers">Build a Contract</Link></Button>
            <Button size="lg" variant="ghost" asChild><Link href="/explorer">Explore Chain</Link></Button>
            </div>
          </div>
        </div>
        <div className="zendo-home-market-visual zendo-grid zendo-gap-3">
          <div className="zendo-home-hero-art"><Image src="/images/zendo-homepage-hero.png" alt="Zendo L-1 planet network" fill priority sizes="100vw" style={{objectFit:"contain",objectPosition:"right center"}} /></div>
          {data.coins.slice(0, 3).map((coin) => (
            <Link key={coin.mint} href={`/launchpad/${coin.mint}`} className="zendo-glow-card zendo-rounded-3xl zendo-border zendo-border-line zendo-bg-panel zendo-p-4 hover:zendo-border-lime/40">
              <div className="zendo-flex zendo-items-center zendo-gap-3">
                <span className="zendo-text-2xl">{coin.emoji}</span>
                <div>
                  <p className="zendo-font-semibold">{coin.name}</p>
                  <p className="zendo-text-xs zendo-text-muted">${coin.symbol} · mcap {coin.marketCap} Z</p>
                </div>
                <span className={`zendo-ml-auto zendo-text-sm ${coin.changeUp ? "zendo-text-lime" : "zendo-text-coral"}`}>{coin.change}</span>
              </div>
              <PriceChart points={coin.chart} up={coin.changeUp} />
            </Link>
          ))}
        </div>
      </section>
      <section className="zendo-home-stats-wrap zendo-mx-auto zendo-max-w-6xl zendo-px-4 zendo-pb-6">
        <dl className="zendo-home-stats zendo-grid zendo-grid-cols-1 zendo-text-sm zendo-sm:zendo-grid-cols-3">
          <Stat icon={<Users />} tone="cyan" k="Active Users / Accounts" v={data.status.accounts > 1000 ? `${(data.status.accounts / 1000).toFixed(0)}k+` : data.status.accounts > 0 ? `${data.status.accounts}+` : "10,000+"} />
          <Stat icon={<ArrowLeftRight />} tone="blue" k="Transactions" v={data.status.tps > 0 ? `${String(Math.round(data.status.tps * 60))}+` : "50,000+"} />
          <Stat icon={<CircleDollarSign />} tone="lime" k="ZCoin Ecosystem Token" v="$ZCoin" />
          <Stat icon={<Rocket />} tone="purple" k="Create a Coin" v="0.2 ZCoin" />
          <Stat icon={<Target />} tone="orange" k="Graduation Threshold" v="10,000 ZCoin" />
        </dl>
      </section>
      <section className="zendo-mx-auto zendo-grid zendo-max-w-6xl zendo-gap-4 zendo-px-4 zendo-pb-6 zendo-md:zendo-grid-cols-4">
        {ecosystemCards.map(([_icon, title, body, href]) => (
          <Link key={title} href={href} className="zendo-ecosystem-card zendo-rounded-3xl zendo-border zendo-border-line zendo-bg-panel zendo-p-5 hover:zendo-border-lime/50">
            <span className="zendo-ecosystem-icon" aria-hidden="true">{title === "Meme Coin Launchpad" ? <LaunchpadArt /> : title === "Developer Studio" ? <StudioArt /> : title === "Zendo Explorer" ? <ExplorerCubeArt /> : <ZCoinArt />}</span>
            <h2 className="zendo-font-display zendo-text-2xl zendo-font-bold">{title}</h2>
            <p className="zendo-mt-2 zendo-text-sm zendo-leading-6 zendo-text-muted">{body}</p>
          </Link>
        ))}
      </section>
      </div>
      <section className="zendo-home-resources zendo-mx-auto zendo-max-w-6xl zendo-px-4 zendo-pb-8">
        <div className="zendo-flex zendo-flex-wrap zendo-items-end zendo-justify-between zendo-gap-3">
          <div><p className="zendo-text-xs zendo-font-semibold zendo-uppercase zendo-tracking-[0.16em] zendo-text-lime">Resources</p><h2 className="zendo-mt-1 zendo-font-display zendo-text-2xl zendo-font-bold">Build with the Zendo ecosystem</h2></div>
          <p className="zendo-max-w-md zendo-text-sm zendo-text-muted">Technical downloads and documentation for operators, developers, and ecosystem participants.</p>
        </div>
        <div className="zendo-mt-4 zendo-grid zendo-gap-3 zendo-sm:zendo-grid-cols-2 zendo-lg:zendo-grid-cols-4">
          <ZendoL1ZipLink className="zendo-resource-link">Download ZendoDeployL1.zip</ZendoL1ZipLink>
          <Link href="/whitepaper" className="zendo-resource-link">Read the white paper</Link>
          <ZendoCoinZipLink className="zendo-resource-link">Polygon contracts</ZendoCoinZipLink>
          <a href="/Zendo.apk" className="zendo-resource-link">Android APK</a>
        </div>
      </section>
      <section id="fees" className="zendo-mx-auto zendo-max-w-6xl zendo-px-4 zendo-py-10">
        <h2 className="zendo-font-display zendo-text-3xl zendo-font-bold">Fees you can read</h2>
        <div className="zendo-mt-4 zendo-overflow-x-auto zendo-rounded-3xl zendo-border zendo-border-line">
          <table className="zendo-w-full zendo-min-w-[520px] zendo-text-left zendo-text-sm">
            <tbody>
              {[
                ["Transfer", `${data.fees.transfer} Z`],
                ["Create a coin", `${data.fees.createCoin} Z`],
                ["Trade", `${data.fees.tradePct}% plus ${data.fees.tradeGas} Z gas`],
                ["Creator share of a trade", `${data.fees.creatorPct}% of notional`],
                ["Promote a coin", `${data.fees.promote} Z for 24h`],
                ["Stake / vote / propose", `${data.fees.stake} / ${data.fees.vote} / ${data.fees.proposal} Z`],
                ["Staking reward rate", `${data.fees.apr}% APR before commission, paid from the existing supply`],
                ["New wallet", data.fees.airdrop === "0" ? "0 Z. The faucet is closed." : `${data.fees.airdrop} Z from the faucet`],
              ].map(([k, v]) => (
                <tr key={k} className="zendo-border-t zendo-border-line first:zendo-border-t-0">
                  <td className="zendo-px-4 zendo-py-3 zendo-text-muted">{k}</td>
                  <td className="zendo-px-4 zendo-py-3">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="zendo-mx-auto zendo-grid zendo-max-w-6xl zendo-gap-6 zendo-px-4 zendo-py-6 zendo-lg:zendo-grid-cols-2">
        <div>
          <h2 className="zendo-font-display zendo-text-3xl zendo-font-bold">Non-custodial by construction</h2>
          <div className="zendo-mt-4 zendo-space-y-3 zendo-text-sm zendo-leading-6 zendo-text-muted">
            <p>Zendo never holds a pooled wallet. A new account derives its address from a 12-word phrase that the server hashes and then drops. Balances live in that address on this node.</p>
            <p>Minting and trading happen in the launchpad state machine. If you later add fiat, a licensed processor would have to do that work. This software does not move money between bank accounts.</p>
            <p>Whether an operator needs a money-transmitter license depends on what they actually do, and on the law where they operate. This page is the design, not a legal opinion. Read the terms and talk to counsel before treating any fork as a live financial service.</p>
            <p>{data.vesting.launched ? `Public launch ${new Date(data.vesting.anchor || 0).toUTCString()}. Founder vesting unlocked so far: ${data.vesting.unlockedPct}. Claimable into founder wallets: ${data.vesting.claimable} Z.` : `Public launch has not happened. Founder coins stay locked until Zendo is live for public use. Claimable now: ${data.vesting.claimable} Z.`} The system wallet does not receive those coins.</p>
          </div>
        </div>
        <div className="zendo-rounded-3xl zendo-border zendo-border-line zendo-bg-panel zendo-p-5">
          <h3 className="zendo-font-semibold">Ship it on a small machine</h3>
          <ol className="zendo-mt-3 zendo-list-decimal zendo-space-y-2 zendo-pl-5 zendo-text-sm zendo-leading-6 zendo-text-muted">
            <li>Boot the Next.js node. It reads <span className="zendo-text-cream">zendo-blockchain.toml</span>.</li>
            <li>Create accounts. New wallets start at 0 ZCoin. The faucet does not pay them.</li>
            <li>Launch a coin or delegate to a validator.</li>
            <li>Watch blocks, fees, and proposals in the explorer and the operator desk.</li>
          </ol>
          <Button className="zendo-mt-5" asChild><Link href="/developers">Read the SDK</Link></Button>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, tone, k, v }: { icon: ReactNode; tone: "cyan" | "blue" | "lime" | "purple" | "orange"; k: string; v: string }) {
  return (
    <div className={`zendo-home-stat zendo-home-stat-${tone}`}>
      <span className="zendo-home-stat-icon" aria-hidden="true">{icon}</span>
      <div><dt>{k}</dt><dd className="num">{v}</dd></div>
    </div>
  );
}
