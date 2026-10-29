import type { Metadata } from "next";
import Link from "next/link";
import { blocks, status } from "@/lib/engine";
import { BlockTable } from "@/components/explorer";
import { SearchBox } from "@/components/search-box";
import { ExplorerCubeArt } from "@/components/reference-art";
import { PaperFrame } from "@/components/chrome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Explorer" };

const bg = "rgba(14,20,38,.97)";
const border = "1px solid rgba(255,255,255,.09)";

export default async function Page() {
  const [chain, recent] = await Promise.all([status(), blocks(8)]);

  const stats = [
    { label: "Latest Block", value: chain.height.toLocaleString() },
    { label: "Block Time", value: `${(chain.avgBlockMs / 1000).toFixed(1)}s` },
    { label: "Total Transactions", value: "50,000+" },
    { label: "Active Contracts", value: chain.accounts.toLocaleString() },
  ];

  const navLinks = [
    ["/explorer/blocks", "Blocks"],
    ["/explorer/txs", "Transactions"],
    ["/explorer/contracts", "Contracts"],
    ["/explorer/validators", "Tokens"],
  ];

  return (
    <div style={{ maxWidth: "90rem", margin: "0 auto", padding: "1.25rem 1.25rem 3rem" }}>

      {/* ── Hero ── */}
      <div style={{ background: bg, border, borderRadius: "1.15rem", padding: "2rem", marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "-3rem", right: "12rem", width: "18rem", height: "18rem", borderRadius: "999px", background: "radial-gradient(circle,rgba(59,130,246,.15),transparent 70%)", pointerEvents: "none" }} />

        <div style={{ flex: 1, position: "relative" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0 0 .5rem", lineHeight: 1.1 }}>Zendo L-1 Explorer</h1>
          <p style={{ fontSize: ".85rem", color: "#8d967f", margin: "0 0 1.5rem" }}>Real-time blockchain data, transactions, blocks, and contracts.</p>

          {/* Search */}
          <div style={{ maxWidth: "32rem" }}>
            <SearchBox />
          </div>
        </div>

        {/* 3D cube art */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <ExplorerCubeArt />
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{ background: bg, border, borderRadius: "1rem", padding: "1.1rem 1.25rem" }}>
            <p style={{ fontSize: ".7rem", fontWeight: 600, color: "#8d967f", margin: "0 0 .35rem", textTransform: "uppercase" as const, letterSpacing: ".08em" }}>{label}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, fontVariantNumeric: "tabular-nums" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 240px", gap: "1.25rem", alignItems: "start" }}>

        {/* LEFT — Blocks table */}
        <div style={{ background: bg, border, borderRadius: "1.15rem", overflow: "hidden" }}>
          {/* Sub-nav tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".85rem 1.25rem", borderBottom: border }}>
            <div style={{ display: "flex", gap: ".4rem" }}>
              {navLinks.map(([href, label], i) => (
                <Link key={href} href={href} style={{ padding: ".35rem .85rem", borderRadius: ".55rem", fontSize: ".78rem", fontWeight: 700, textDecoration: "none", background: i === 0 ? "linear-gradient(135deg,#c8ff00,#8bc900)" : "rgba(255,255,255,.05)", color: i === 0 ? "#0a0a0a" : "#8d967f", border: i === 0 ? "none" : border }}>
                  {label}
                </Link>
              ))}
            </div>
            <Link href="/explorer/blocks" style={{ fontSize: ".75rem", color: "#c8ff00", textDecoration: "none", fontWeight: 600 }}>
              View All Blocks →
            </Link>
          </div>

          {/* Block table */}
          <div style={{ overflowX: "auto" as const }}>
            <table style={{ width: "100%", minWidth: "560px", borderCollapse: "collapse" as const, fontSize: ".8rem" }}>
              <thead>
                <tr style={{ borderBottom: border }}>
                  {["Block", "Hash", "Transactions", "Timestamp", "Validator"].map(h => (
                    <th key={h} style={{ padding: ".65rem 1.1rem", textAlign: "left" as const, color: "#8d967f", fontWeight: 600, fontSize: ".72rem", textTransform: "uppercase" as const, letterSpacing: ".07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((block, i) => (
                  <tr key={block.height} style={{ borderBottom: i < recent.length - 1 ? border : "none" }}>
                    <td style={{ padding: ".7rem 1.1rem" }}>
                      <Link href={`/explorer/block/${block.height}`} style={{ color: "#c8ff00", textDecoration: "none", fontWeight: 700 }}>{block.height.toLocaleString()}</Link>
                    </td>
                    <td style={{ padding: ".7rem 1.1rem", fontFamily: "monospace", fontSize: ".72rem", color: "#8d967f" }}>{block.hash.slice(0, 12)}…</td>
                    <td style={{ padding: ".7rem 1.1rem" }}>{block.txCount}</td>
                    <td style={{ padding: ".7rem 1.1rem", color: "#8d967f", fontSize: ".75rem" }}>
                      {new Date(block.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: ".7rem 1.1rem", fontFamily: "monospace", fontSize: ".72rem", color: "#8d967f" }}>{block.proposerName || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — Network status */}
        <div style={{ background: bg, border, borderRadius: "1.15rem", padding: "1.15rem", position: "sticky", top: "5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".85rem" }}>
            <p style={{ fontWeight: 700, fontSize: ".9rem", margin: 0 }}>Network Status</p>
            <span style={{ width: ".7rem", height: ".7rem", borderRadius: "999px", background: "#22c55e", boxShadow: "0 0 .5rem #22c55e", display: "inline-block" }} />
          </div>
          <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#c8ff00", margin: "0 0 1rem" }}>Healthy</p>
          <div style={{ display: "grid", gap: ".65rem", fontSize: ".8rem", borderTop: border, paddingTop: "1rem" }}>
            {[
              ["Chain ID", "7001"],
              ["Network", chain.chainName],
              ["Consensus", `PoH (${chain.finalizedHeight.toString().slice(0, 8)})`],
              ["Validators", "24"],
              ["TPS", `~1,000+`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ color: "#8d967f", fontSize: ".73rem" }}>{k}</span>
                <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: ".78rem" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}><PaperFrame /></div>
    </div>
  );
}
