import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { LoadingPanel } from "@/components/ui";

const LaunchBoard = dynamic(() => import("@/components/launchpad").then((mod) => mod.LaunchBoard), {
  loading: () => <LoadingPanel label="Loading the launchpad" />,
});

const CreateCoinForm = dynamic(() => import("@/components/launchpad").then((mod) => mod.CreateCoinForm), {
  loading: () => <LoadingPanel label="Loading form…" />,
});

export const metadata: Metadata = { title: "Meme Coin Launchpad" };

export default function Page() {
  return (
    <div style={{ maxWidth: "90rem", margin: "0 auto", padding: "1.25rem 1.25rem 3rem" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.55rem", fontWeight: 800, margin: "0 0 .2rem", lineHeight: 1.15 }}>Meme Coin Launchpad</h1>
        <p style={{ fontSize: ".82rem", color: "#8d967f", margin: 0 }}>Create. Trade. Grow. Graduate to DEX. All on Zendo L-1.</p>
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT — Coin list */}
        <section>
          <LaunchBoard />
        </section>

        {/* RIGHT — Inline create form panel */}
        <aside style={{ position: "sticky", top: "5rem" }}>
          <div style={{
            background: "linear-gradient(160deg, rgba(15,22,40,.98), rgba(8,12,22,.98))",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "1.25rem",
            boxShadow: "0 0 2.5rem rgba(0,0,0,.4)",
            overflow: "hidden",
          }}>
            {/* Panel header */}
            <div style={{ padding: "1rem 1.25rem .75rem", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
              <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#c8ff00", margin: "0 0 .25rem" }}>
                Create Your Meme Coin
              </p>
              <p style={{ fontSize: ".78rem", color: "#8d967f", margin: 0 }}>
                Launch your token in seconds for 0.2 ZCoin
              </p>
            </div>

            {/* Scrollable form area */}
            <div style={{ padding: "1rem 1.25rem 1.25rem", maxHeight: "calc(100vh - 12rem)", overflowY: "auto" }}>
              <CreateCoinForm />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
