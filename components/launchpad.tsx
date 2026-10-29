"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EMOJIS } from "@/lib/seed";
import { api } from "@/lib/sdk";
import { identityFromPhrase, launchCreateData, signTx } from "@/lib/l1/browser";
import { CREATE_FEE_UNITS, ZERO_ADDRESS } from "@/lib/l1";
import type { CoinCard, CoinDetail, PublicUser, QuoteView } from "@/lib/types";
import { BrandMark, CopyButton, PriceChart, TimeAgo } from "./chrome";
import { Badge, Button, Field, Input, LoadingPanel, Panel, Textarea } from "./ui";
import { LaunchpadArt } from "./reference-art";

export function LaunchBoard() {
  const router = useRouter();
  const [coins, setCoins] = useState<CoinCard[] | null>(null);
  const [sort, setSort] = useState("trending");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    const load = () => {
      api<CoinCard[]>(`/api/coins?sort=${sort}&q=${encodeURIComponent(q)}`)
        .then((rows) => {
          if (!stop) setCoins(rows);
        })
        .catch((err) => {
          if (!stop) setError(err instanceof Error ? err.message : "Could not load coins.");
        });
    };
    load();
    const id = setInterval(load, 5000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [sort, q]);

  const SORT_TABS = ["trending","new","graduating","volume"];

  return (
    <div style={{ display:"grid", gap:"1.25rem" }}>
      {/* ── Toolbar ── */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:".65rem" }}>
        {/* Sort tabs */}
        <div style={{ display:"flex", gap:".35rem", padding:".25rem", borderRadius:".85rem", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)" }}>
          {SORT_TABS.map((tab) => (
            <button key={tab} type="button" onClick={() => setSort(tab)} style={{ padding:".35rem .85rem", borderRadius:".65rem", fontSize:".78rem", fontWeight:600, border:"none", cursor:"pointer", textTransform:"capitalize", transition:"all .15s ease", background: sort === tab ? "linear-gradient(135deg,#c8ff00,#8bc900)" : "transparent", color: sort === tab ? "#0a0a0a" : "#8d967f", boxShadow: sort === tab ? "0 0 .8rem rgba(200,255,0,.3)" : "none" }}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>
        {/* Search */}
        <div style={{ flex:1, minWidth:"180px", position:"relative" }}>
          <span style={{ position:"absolute", left:".85rem", top:"50%", transform:"translateY(-50%)", color:"#8d967f", fontSize:".9rem" }}>🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search coins, ticker, address…" aria-label="Search launchpad coins" style={{ width:"100%", padding:".55rem .85rem .55rem 2.2rem", borderRadius:".85rem", border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.05)", color:"#f4f1e6", fontSize:".85rem", outline:"none", boxSizing:"border-box" }} />
        </div>
        <button type="button" onClick={() => router.push("/launchpad/create")} style={{ padding:".55rem 1.25rem", borderRadius:".85rem", border:"none", cursor:"pointer", fontWeight:700, fontSize:".85rem", background:"linear-gradient(135deg,#c8ff00,#8bc900)", color:"#0a0a0a", boxShadow:"0 0 1.2rem rgba(200,255,0,.3)", whiteSpace:"nowrap" }}>
          ✦ Create a Coin
        </button>
      </div>

      {/* Status row */}
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", color:"#8d967f" }}>
        <span>🔴 Live · Zendo Launchpad Ledger</span>
        {coins ? <span>{coins.length} launch{coins.length === 1 ? "" : "es"}</span> : <span>Loading…</span>}
      </div>

      {error ? <p style={{ fontSize:".85rem", color:"#ff6b5a" }}>{error}</p> : null}

      {/* Skeleton */}
      {!coins && !error ? (
        <div style={{ display:"grid", gap:".85rem", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))" }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} style={{ borderRadius:"1.15rem", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", padding:"1rem", animation:"pulse 1.5s ease-in-out infinite" }}>
              <div style={{ height:"7rem", borderRadius:".85rem", background:"rgba(255,255,255,.06)", marginBottom:".75rem" }} />
              <div style={{ height:".75rem", borderRadius:"4px", background:"rgba(255,255,255,.08)", marginBottom:".4rem", width:"60%" }} />
              <div style={{ height:".6rem", borderRadius:"4px", background:"rgba(255,255,255,.05)", width:"40%" }} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Empty state */}
      {coins && coins.length === 0 ? (
        <Panel className="zendo-launchpad-empty">
          <LaunchpadArt />
          <div>
            <p className="zendo-font-display zendo-text-2xl zendo-font-bold">No coins launched yet</p>
            <p className="zendo-mt-2 zendo-max-w-lg zendo-text-sm zendo-leading-6 zendo-text-muted">The discovery ledger is empty for this filter. Create the first real curve-backed coin.</p>
            <Button className="zendo-mt-4" onClick={() => router.push("/launchpad/create")}>Create the first coin</Button>
          </div>
        </Panel>
      ) : null}

      {/* Coin Cards Grid */}
      <div style={{ display:"grid", gap:".85rem", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))" }}>
        {(coins || []).map((coin) => (
          <Link key={coin.mint} href={`/launchpad/${coin.mint}`} style={{ textDecoration:"none", display:"block", borderRadius:"1.15rem", border:`1px solid hsl(${coin.hue} 60% 35% / 0.35)`, background:`linear-gradient(160deg, hsl(${coin.hue} 30% 10% / 0.95), rgba(8,12,24,.97))`, overflow:"hidden", transition:"all .2s ease", position:"relative" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow=`0 0 1.5rem hsl(${coin.hue} 60% 40% / 0.3)`; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}>
            {/* Top image / emoji banner */}
            <div style={{ height:"7rem", display:"grid", placeItems:"center", background:`linear-gradient(135deg, hsl(${coin.hue} 70% 20% / 0.7), hsl(${coin.hue} 50% 8% / 0.8))`, fontSize:"3.5rem", position:"relative", overflow:"hidden" }}>
              {coin.tokenImage ? <img src={coin.tokenImage} alt={coin.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0, opacity:.9 }} /> : <span style={{ filter:`drop-shadow(0 0 1rem hsl(${coin.hue} 80% 50%))` }}>{coin.emoji}</span>}
              {/* change badge */}
              <span style={{ position:"absolute", top:".5rem", right:".55rem", fontSize:".7rem", fontWeight:700, padding:".2rem .55rem", borderRadius:"999px", background: coin.changeUp ? "rgba(200,255,0,.2)" : "rgba(255,107,90,.2)", color: coin.changeUp ? "#c8ff00" : "#ff6b5a", border:`1px solid ${coin.changeUp ? "rgba(200,255,0,.35)" : "rgba(255,107,90,.35)"}` }}>{coin.change}</span>
              {coin.featured ? <span style={{ position:"absolute", top:".5rem", left:".55rem", fontSize:".65rem", fontWeight:700, padding:".2rem .55rem", borderRadius:"999px", background:"rgba(255,215,0,.2)", color:"#ffd700", border:"1px solid rgba(255,215,0,.35)" }}>⭐ Hot</span> : null}
            </div>
            {/* Card body */}
            <div style={{ padding:".85rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".5rem" }}>
                <span style={{ fontSize:"1.1rem" }}>{coin.emoji}</span>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:".9rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:0 }}>{coin.name}</p>
                  <p style={{ fontSize:".7rem", color:"#8d967f", margin:0 }}>${coin.symbol}</p>
                </div>
              </div>
              {/* Stats row */}
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".6rem" }}>
                <div>
                  <p style={{ fontSize:".62rem", color:"#8d967f", margin:0 }}>Market cap</p>
                  <p style={{ fontSize:".82rem", fontWeight:700, fontVariantNumeric:"tabular-nums", margin:0 }}>{coin.marketCap} Z</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:".62rem", color:"#8d967f", margin:0 }}>{coin.replies} replies</p>
                  <p style={{ fontSize:".62rem", color:"#8d967f", margin:0 }}>{coin.votes} votes</p>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height:".35rem", borderRadius:"999px", background:"rgba(255,255,255,.07)", overflow:"hidden", marginBottom:".65rem" }}>
                <div style={{ height:"100%", borderRadius:"999px", width:`${Math.min(100,Math.max(0,coin.progress))}%`, background:`linear-gradient(90deg, hsl(${coin.hue} 80% 45%), hsl(${coin.hue} 90% 60%))`, boxShadow:`0 0 .5rem hsl(${coin.hue} 80% 50% / .6)` }} />
              </div>
              {/* Bottom row */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:".68rem", color:"#8d967f", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"55%" }}>By {coin.creatorName}</span>
                <div style={{ display:"flex", gap:".35rem" }}>
                  <span style={{ fontSize:".68rem", fontWeight:700, padding:".22rem .6rem", borderRadius:"999px", background:"rgba(200,255,0,.12)", color:"#c8ff00", border:"1px solid rgba(200,255,0,.3)" }}>Buy</span>
                  <span style={{ fontSize:".68rem", fontWeight:700, padding:".22rem .6rem", borderRadius:"999px", background:"rgba(255,107,90,.1)", color:"#ff8577", border:"1px solid rgba(255,107,90,.25)" }}>Sell</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CreateCoinForm() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);
  const [form, setForm] = useState({ name: "", symbol: "", description: "", emoji: "🐸", hue: 88 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [phrase, setPhrase] = useState("");
  const imagePreview = useMemo(() => {
    if (typeof window === "undefined" || !imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);
  const [links, setLinks] = useState({ twitterUrl: "", telegramUrl: "", websiteUrl: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ user: PublicUser | null }>("/api/auth/me").then((data) => setUser(data.user)).catch(() => setUser(null));
  }, []);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!currentUser.l1Address) throw new Error("This account has no native signing address.");
      const [account, programResult] = await Promise.all([
        api<{ address: string; nonce: number; balance: string; fee: string }>("/api/wallet/nonce"),
        api<{ program: string }>("/api/l1/launch-program"),
      ]);
      const fee = BigInt(account.fee);
      if (BigInt(account.balance) < CREATE_FEE_UNITS + fee) throw new Error("Insufficient ZCOIN balance for the 0.2 ZCoin creation fee plus network fee.");
      const identity = identityFromPhrase(currentUser.email.trim().toLowerCase(), phrase);
      if (identity.address !== account.address) throw new Error("That recovery phrase does not match this account.");
      const signed = signTx(identity, { nonce: account.nonce, to: ZERO_ADDRESS, amount: CREATE_FEE_UNITS, fee, data: launchCreateData(programResult.program) });
      let tokenImage: string | null = null;
      if (imageFile) {
        const body = new FormData();
        body.append("image", imageFile);
        const uploaded = await fetch("/api/coins/media", { method: "POST", body, credentials: "include" });
        const payload = await uploaded.json().catch(() => ({}));
        if (!uploaded.ok || typeof payload.url !== "string") throw new Error(typeof payload.error === "string" ? payload.error : "Could not upload the token image.");
        tokenImage = payload.url;
      }
      const result = await api<{ coin: CoinDetail | null }>("/api/coins", { method: "POST", body: JSON.stringify({ ...form, ...links, tokenImage, program: programResult.program, tx: signed }) });
      if (!result.coin) throw new Error("The transaction confirmed, but the launchpad read model is still catching up. Refresh Launchpad shortly.");
      toast.success(`${result.coin.symbol} is on the curve`);
      router.push(`/launchpad/${result.coin.mint}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the coin.");
    } finally {
      setPhrase("");
      setBusy(false);
    }
  }

  if (user === undefined) return <p className="zendo-text-muted">Checking your session…</p>;
  if (!user) {
    return (
      <Panel>
        <p>Log in before you create a coin. The 0.2 Z creation fee is paid from your wallet on this chain.</p>
        <Button className="zendo-mt-4" onClick={() => router.push("/signin?next=/launchpad/create")}>Sign in</Button>
      </Panel>
    );
  }

  const currentUser = user;

  const COLOR_HUES = [0, 30, 60, 90, 150, 200, 240, 270, 300, 330];

  const inputStyle = (hue = form.hue): React.CSSProperties => ({
    width: "100%", padding: ".5rem .75rem", borderRadius: ".6rem",
    border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)",
    color: "#f4f1e6", fontSize: ".82rem", outline: "none", boxSizing: "border-box" as const,
  });

  const labelStyle: React.CSSProperties = {
    fontSize: ".72rem", fontWeight: 600, color: "#8d967f",
    display: "block", marginBottom: ".3rem",
  };

  return (
    <form onSubmit={submit} autoComplete="off" style={{ display: "grid", gap: "1rem" }}>

      {/* Token Name */}
      <div>
        <label style={labelStyle}>Token Name</label>
        <input name="coin-name" autoComplete="off" placeholder="e.g. Zendo Pepe" required
          value={form.name} onChange={(e) => setForm(c => ({ ...c, name: e.target.value }))}
          style={inputStyle()} />
      </div>

      {/* Ticker + Icon row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".65rem" }}>
        <div>
          <label style={labelStyle}>Ticker (2–8 characters)</label>
          <input name="coin-ticker" autoComplete="off" placeholder="e.g. ZPEPE" required minLength={2} maxLength={8}
            value={form.symbol} onChange={(e) => { const symbol = e.target.value.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase(); setForm(c => ({ ...c, symbol })); }}
            style={inputStyle()} />
        </div>
        <div>
          <label style={labelStyle}>Icon</label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "2.5rem", borderRadius: ".6rem", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", cursor: "pointer", overflow: "hidden", position: "relative", fontSize: imagePreview ? "1rem" : ".8rem", color: "#8d967f" }}>
            {imagePreview ? <img src={imagePreview} alt="icon" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} /> : <>{form.emoji} Choose</>}
            <input name="coin-image" type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea name="coin-description" autoComplete="off" required rows={2} placeholder="Tell your story…"
          value={form.description} onChange={(e) => setForm(c => ({ ...c, description: e.target.value }))}
          style={{ ...inputStyle(), resize: "vertical", fontFamily: "inherit" }} />
      </div>

      {/* Select Icon — Emoji tabs */}
      <div>
        <label style={labelStyle}>Select Icon</label>
        <div style={{ display: "flex", gap: ".5rem", marginBottom: ".5rem" }}>
          <span style={{ padding: ".3rem .8rem", borderRadius: ".5rem", background: "rgba(200,255,0,.15)", color: "#c8ff00", fontSize: ".72rem", fontWeight: 700, border: "1px solid rgba(200,255,0,.3)" }}>Emoji</span>
          <label style={{ padding: ".3rem .8rem", borderRadius: ".5rem", background: "rgba(255,255,255,.05)", color: "#8d967f", fontSize: ".72rem", fontWeight: 600, border: "1px solid rgba(255,255,255,.09)", cursor: "pointer", position: "relative" }}>
            Custom Image
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
          </label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem", alignItems: "center" }}>
          {EMOJIS.map((emoji) => (
            <button type="button" key={emoji} onClick={() => setForm(c => ({ ...c, emoji }))}
              style={{ width: "2rem", height: "2rem", borderRadius: ".45rem", fontSize: "1rem", border: form.emoji === emoji ? `2px solid #c8ff00` : "1px solid rgba(255,255,255,.08)", background: form.emoji === emoji ? "rgba(200,255,0,.15)" : "rgba(255,255,255,.04)", cursor: "pointer", transition: "all .12s" }}>
              {emoji}
            </button>
          ))}
          <span style={{ width: "2rem", height: "2rem", display: "grid", placeItems: "center", borderRadius: ".45rem", border: "1px solid rgba(255,255,255,.08)", color: "#8d967f", fontSize: ".85rem", cursor: "default" }}>+</span>
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <label style={labelStyle}>Primary Color</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", alignItems: "center" }}>
          {COLOR_HUES.map((hue) => (
            <button type="button" key={hue} onClick={() => setForm(c => ({ ...c, hue }))}
              style={{ width: "1.6rem", height: "1.6rem", borderRadius: "999px", border: form.hue === hue ? "3px solid #fff" : "2px solid transparent", background: `hsl(${hue} 80% 50%)`, cursor: "pointer", boxShadow: form.hue === hue ? `0 0 .7rem hsl(${hue} 80% 50% / .7)` : "none", outline: "none" }} />
          ))}
          <span style={{ width: "1.6rem", height: "1.6rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,.15)", background: `linear-gradient(135deg,hsl(${form.hue} 80% 50%),hsl(${(form.hue + 120) % 360} 80% 50%))`, display: "inline-block" }} />
          <input type="range" min={0} max={360} value={form.hue} onChange={(e) => setForm(c => ({ ...c, hue: Number(e.target.value) }))}
            style={{ flex: 1, minWidth: "50px", accentColor: `hsl(${form.hue} 80% 50%)` }} />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label style={labelStyle}>Social Links (Optional)</label>
        <div style={{ display: "grid", gap: ".4rem" }}>
          {[
            { icon: "𝕏", placeholder: "Twitter / X URL", key: "twitterUrl" as const },
            { icon: "✈", placeholder: "Telegram URL", key: "telegramUrl" as const },
            { icon: "🌐", placeholder: "Website URL", key: "websiteUrl" as const },
          ].map(({ icon, placeholder, key }) => (
            <div key={key} style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: ".7rem", top: "50%", transform: "translateY(-50%)", color: "#8d967f", fontSize: ".8rem", pointerEvents: "none" }}>{icon}</span>
              <input type="url" placeholder={placeholder} value={links[key]} onChange={(e) => setLinks(c => ({ ...c, [key]: e.target.value }))}
                style={{ ...inputStyle(), paddingLeft: "2rem" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Initial Buy Amount */}
      <div>
        <label style={labelStyle}>Initial Buy Amount (Optional)</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: ".7rem", top: "50%", transform: "translateY(-50%)", color: "#8d967f", fontSize: ".8rem" }}>Z</span>
          <input type="number" min="0" step="any" placeholder="Amount in ZCoin" disabled
            style={{ ...inputStyle(), paddingLeft: "1.8rem", opacity: .5, cursor: "not-allowed" }} />
        </div>
      </div>

      {/* Recovery Phrase */}
      <div>
        <label style={labelStyle}>Recovery Phrase</label>
        <input type="password" autoComplete="off" required value={phrase} onChange={(e) => setPhrase(e.target.value)}
          placeholder="Sign locally — never sent to server"
          style={{ ...inputStyle(), border: "1px solid rgba(255,200,0,.2)", background: "rgba(255,200,0,.04)" }} />
      </div>

      {error ? <p style={{ fontSize: ".78rem", color: "#ff6b5a", margin: 0 }}>{error}</p> : null}

      {/* Submit */}
      <button type="submit" disabled={busy} style={{
        width: "100%", height: "3rem", borderRadius: ".85rem", border: "none",
        cursor: busy ? "not-allowed" : "pointer", fontWeight: 800, fontSize: ".9rem",
        background: busy ? "rgba(255,255,255,.08)" : "linear-gradient(135deg,#c8ff00,#8bc900)",
        color: busy ? "#555" : "#0a0a0a",
        boxShadow: busy ? "none" : "0 4px 1.5rem rgba(200,255,0,.35)",
        transition: "all .18s ease",
      }}>
        {busy ? "Creating…" : "🚀 Create Coin (0.2 ZCoin)"}
      </button>
    </form>
  );
}


export function CoinScreen({ mint }: { mint: string }) {

  const router = useRouter();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<QuoteView | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tradeReceipt, setTradeReceipt] = useState<{ id: string; height: number | null } | null>(null);
  const [reply, setReply] = useState("");
  const [user, setUser] = useState<PublicUser | null>(null);

  async function load() {
    const [next, me] = await Promise.all([
      api<CoinDetail>(`/api/coins/${mint}`),
      api<{ user: PublicUser | null }>("/api/auth/me"),
    ]);
    setCoin(next);
    setUser(me.user);
  }

  useEffect(() => {
    let stop = false;
    const pull = () => {
      Promise.all([
        api<CoinDetail>(`/api/coins/${mint}`),
        api<{ user: PublicUser | null }>("/api/auth/me"),
      ])
        .then(([next, me]) => {
          if (stop) return;
          setCoin(next);
          setUser(me.user);
        })
        .catch((err) => {
          if (!stop) setError(err instanceof Error ? err.message : "Coin unavailable.");
        });
    };
    pull();
    const id = setInterval(pull, 5000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [mint]);

  useEffect(() => {
    if (!amount) return;
    const timer = setTimeout(() => {
      api<QuoteView>(`/api/coins/${mint}/quote`, { method: "POST", body: JSON.stringify({ side, amount }) })
        .then((next) => {
          setQuote(next);
          setQuoteError(null);
        })
        .catch((err) => {
          setQuote(null);
          setQuoteError(err instanceof Error ? err.message : "No quote.");
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [amount, side, mint, coin?.price]);

  async function trade() {
    setBusy(true);
    setTradeReceipt(null);
    try {
      const settled = await api<{ id: string; height: number | null }>(`/api/coins/${mint}/trade`, { method: "POST", body: JSON.stringify({ side, amount }) });
      setTradeReceipt({ id: settled.id, height: settled.height });
      toast.success(side === "buy" ? "Buy included" : "Sell included");
      setAmount("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Trade failed.");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <Panel><p className="zendo-text-coral">{error}</p></Panel>;
  if (!coin) return <LoadingPanel label="Loading the curve" />;

  return (
    <div className="zendo-grid zendo-gap-6 zendo-lg:zendo-grid-cols-[minmax(0,1fr)_340px]">
      <div className="zendo-order-2 zendo-grid zendo-gap-4 zendo-lg:zendo-order-1">
        <BrandMark kind="coin" />
        {/* Coin Identity Hero */}
        <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.25rem", borderRadius:"1.25rem", background:"linear-gradient(135deg,rgba(14,22,45,.9),rgba(8,12,24,.9))", border:`1px solid hsl(${coin.hue} 70% 42% / 0.35)`, boxShadow:`0 0 2.5rem hsl(${coin.hue} 70% 42% / 0.12)` }}>
          <span style={{ display:"grid", width:"4.25rem", height:"4.25rem", placeItems:"center", borderRadius:"1.15rem", fontSize:"2.1rem", flexShrink:0, background:`hsl(${coin.hue} 70% 42% / 0.25)`, boxShadow:`0 0 1.5rem hsl(${coin.hue} 70% 42% / 0.45)` }}>{coin.emoji}</span>
          <div style={{ minWidth:0, flex:1 }}>
            <h1 style={{ margin:0, fontSize:"1.8rem", fontWeight:800, lineHeight:1.1 }}>{coin.name}</h1>
            <p style={{ margin:".2rem 0 0", fontSize:".82rem", color:"#8d967f" }}>${coin.symbol} · {coin.creatorName} · <TimeAgo at={coin.createdAt} /></p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".35rem", flexShrink:0 }}>
            {coin.graduated ? <Badge tone="lime">Pool</Badge> : <Badge>Curve</Badge>}
            {coin.featured ? <Badge tone="gold">Promoted</Badge> : null}
          </div>
        </div>
        <Panel>
          <div className="zendo-mb-2 zendo-flex zendo-items-end zendo-justify-between">
            <div>
              <p className="zendo-text-xs zendo-text-muted">Price</p>
              <p className="num zendo-text-2xl zendo-font-semibold">{coin.price} Z</p>
            </div>
            <p className={coin.changeUp ? "zendo-text-lime" : "zendo-text-coral"}>{coin.change}</p>
          </div>
          <PriceChart points={coin.chart} up={coin.changeUp} />
          <div className="zendo-mt-3">
            <div className="zendo-mb-1 zendo-flex zendo-justify-between zendo-text-xs zendo-text-muted">
              <span>{coin.venue === "pool" ? "Graduated into the pool" : "Progress to the pool"}</span>
              <span>{coin.realZ} / {coin.graduationZ} Z</span>
            </div>
            <div style={{ height:".5rem", borderRadius:"999px", background:"rgba(255,255,255,.07)", overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:"999px", width:`${Math.min(100,coin.progress)}%`, background:"linear-gradient(90deg,#8bc900,#c8ff00)", boxShadow:"0 0 .6rem rgba(200,255,0,.5)" }} />
            </div>
          </div>
        </Panel>
        <p className="zendo-text-sm zendo-leading-6 zendo-text-muted">{coin.description}</p>
        {coin.tokenImage || coin.twitterUrl || coin.telegramUrl || coin.websiteUrl ? (
          <Panel>
            <div className="zendo-flex zendo-flex-wrap zendo-items-center zendo-gap-3">
              {coin.tokenImage ? <img src={coin.tokenImage} alt={`${coin.name} token`} className="zendo-h-20 zendo-w-20 zendo-rounded-2xl zendo-object-cover" /> : null}
              <div className="zendo-flex zendo-flex-wrap zendo-gap-2 zendo-text-sm">
                {coin.twitterUrl ? <a href={coin.twitterUrl} target="_blank" rel="noopener noreferrer" className="zendo-text-lime hover:zendo-underline">X / Twitter</a> : null}
                {coin.telegramUrl ? <a href={coin.telegramUrl} target="_blank" rel="noopener noreferrer" className="zendo-text-lime hover:zendo-underline">Telegram</a> : null}
                {coin.websiteUrl ? <a href={coin.websiteUrl} target="_blank" rel="noopener noreferrer" className="zendo-text-lime hover:zendo-underline">Website</a> : null}
              </div>
            </div>
          </Panel>
        ) : null}
        <Panel>
          <h2 style={{ fontWeight:700, fontSize:"1rem", marginBottom:".75rem" }}>👥 Holders</h2>
          <div className="zendo-grid zendo-gap-2 zendo-text-sm">
            {coin.holders.length === 0 ? <p className="zendo-text-muted">No holders yet.</p> : null}
            {coin.holders.map((holder, i) => (
              <div key={holder.address} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".4rem .65rem", borderRadius:".65rem", background: i === 0 ? "rgba(200,255,0,.05)" : "transparent" }}>
                <Link href={`/explorer/address/${holder.address}`} style={{ color: i === 0 ? "#c8ff00" : "#8d967f", textDecoration:"none", fontSize:".82rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"60%" }}>
                  {i === 0 ? "👑 " : ""}{holder.name}
                </Link>
                <span style={{ fontSize:".8rem", fontVariantNumeric:"tabular-nums", color:"#f4f1e6" }}>{holder.amount} · {holder.pct}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 style={{ fontWeight:700, fontSize:"1rem", marginBottom:".75rem" }}>💬 Thread</h2>
          {user ? (
            <form className="zendo-mt-3 zendo-grid zendo-gap-2" onSubmit={async (event) => {
              event.preventDefault();
              try {
                const next = await api<CoinDetail>(`/api/coins/${mint}/reply`, { method: "POST", body: JSON.stringify({ body: reply }) });
                setCoin(next); setReply("");
              } catch (err) { toast.error(err instanceof Error ? err.message : "Reply failed."); }
            }}>
              <Textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Say something specific." />
              <Button type="submit" size="sm" className="zendo-justify-self-start">Post</Button>
            </form>
          ) : (
            <p className="zendo-mt-2 zendo-text-sm zendo-text-muted">Sign in to reply.</p>
          )}
          <div className="zendo-mt-4 zendo-grid zendo-gap-3">
            {coin.replyRows.length === 0 ? <p className="zendo-text-sm zendo-text-muted">No replies yet.</p> : null}
            {coin.replyRows.map((row) => (
              <div key={row.id} style={{ borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:".75rem" }}>
                <p className="zendo-text-sm"><span className="zendo-font-medium">{row.name}</span> <span className="zendo-text-muted"><TimeAgo at={row.at} /></span></p>
                <p className="zendo-mt-1 zendo-text-sm zendo-text-muted">{row.body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Premium Buy/Sell Sidebar ── */}
      <aside className="zendo-order-1 zendo-lg:zendo-sticky zendo-lg:zendo-top-20 zendo-lg:zendo-order-2 zendo-lg:zendo-self-start">
        <div style={{ background:"linear-gradient(145deg,rgba(14,22,45,.97),rgba(10,14,28,.97))", border:"1px solid rgba(200,255,0,.18)", borderRadius:"1.5rem", boxShadow:"0 0 2.5rem rgba(200,255,0,.07),inset 0 1px rgba(255,255,255,.06)", padding:"1.25rem", backdropFilter:"blur(12px)" }}>
          {/* Coin mini header in sidebar */}
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
            <span style={{ display:"grid", width:"2.75rem", height:"2.75rem", placeItems:"center", borderRadius:".85rem", fontSize:"1.35rem", background:`hsl(${coin.hue} 70% 42% / 0.3)`, boxShadow:`0 0 1rem hsl(${coin.hue} 70% 42% / 0.4)`, flexShrink:0 }}>{coin.emoji}</span>
            <div style={{ minWidth:0, flex:1 }}>
              <p style={{ fontWeight:700, fontSize:".95rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", margin:0 }}>{coin.name}</p>
              <p style={{ fontSize:".7rem", color:"#8d967f", margin:0 }}>${coin.symbol}</p>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <p style={{ fontWeight:700, color: coin.changeUp ? "#c8ff00" : "#ff6b5a", fontSize:".9rem", margin:0 }}>{coin.change}</p>
              <p style={{ fontSize:".65rem", color:"#555", margin:0 }}>24h</p>
            </div>
          </div>

          {/* Buy / Sell tabs */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".5rem", marginBottom:"1rem" }}>
            {(["buy", "sell"] as const).map((item) => (
              <button key={item} onClick={() => setSide(item)} style={{ height:"2.75rem", borderRadius:".85rem", fontSize:".9rem", fontWeight:700, border:"none", cursor:"pointer", transition:"all .18s ease", background: side === item ? (item === "buy" ? "linear-gradient(135deg,#c8ff00,#8bc900)" : "linear-gradient(135deg,#ff6b5a,#cc3a2a)") : "rgba(255,255,255,.06)", color: side === item ? (item === "buy" ? "#0a0a0a" : "#fff") : "#8d967f", boxShadow: side === item ? (item === "buy" ? "0 0 1rem rgba(200,255,0,.35)" : "0 0 1rem rgba(255,107,90,.3)") : "none" }}>
                {item === "buy" ? "Buy" : "Sell"}
              </button>
            ))}
          </div>

          {/* Amount input */}
          <div style={{ marginBottom:".75rem" }}>
            <p style={{ fontSize:".72rem", color:"#8d967f", marginBottom:".4rem" }}>{side === "buy" ? "You pay (ZCoin)" : `You sell (${coin.symbol})`}</p>
            <div style={{ position:"relative" }}>
              <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" style={{ width:"100%", padding:".75rem 3.5rem .75rem 1rem", borderRadius:".85rem", border:`1px solid ${side === "buy" ? "rgba(200,255,0,.22)" : "rgba(255,107,90,.22)"}`, background:"rgba(0,0,0,.35)", color:"#f4f1e6", fontSize:"1.05rem", fontWeight:600, outline:"none", boxSizing:"border-box", fontVariantNumeric:"tabular-nums" }} />
              <span style={{ position:"absolute", right:".9rem", top:"50%", transform:"translateY(-50%)", fontSize:".7rem", color:"#8d967f", fontWeight:700 }}>{side === "buy" ? "Z" : coin.symbol}</span>
            </div>
            {coin.yourTokens ? <p style={{ marginTop:".3rem", fontSize:".7rem", color:"#8d967f" }}>Balance: {coin.yourTokens} {coin.symbol}</p> : null}
          </div>

          {/* Quote breakdown */}
          {amount && quote ? (
            <div style={{ marginBottom:".75rem", padding:".75rem", borderRadius:".85rem", background:"rgba(200,255,0,.04)", border:"1px solid rgba(200,255,0,.1)" }}>
              {[{ k:"You receive", v: side === "buy" ? `${quote.tokens} ${coin.symbol}` : `${quote.proceeds} Z` }, { k:"Fee", v:`${quote.fee} Z` }, { k:"Network", v:`${quote.gas} Z` }, { k:"Price impact", v:quote.impact }].map(({ k, v }) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:".78rem", marginBottom:".2rem" }}>
                  <span style={{ color:"#8d967f" }}>{k}</span><span style={{ color:"#f4f1e6", fontVariantNumeric:"tabular-nums" }}>{v}</span>
                </div>
              ))}
              {quote.capped ? <p style={{ fontSize:".72rem", color:"#ffd700", marginTop:".3rem" }}>Filled up to curve limit.</p> : null}
            </div>
          ) : null}
          {amount && quoteError ? <p style={{ marginBottom:".75rem", fontSize:".78rem", color:"#ff6b5a" }}>{quoteError}</p> : null}

          {/* Confirmed receipt */}
          {tradeReceipt ? (
            <div style={{ marginBottom:".75rem", padding:".75rem", borderRadius:".85rem", background:"rgba(200,255,0,.06)", border:"1px solid rgba(200,255,0,.25)" }}>
              <p style={{ fontWeight:700, color:"#c8ff00", fontSize:".82rem", margin:0 }}>✓ Confirmed on Zendo L-1</p>
              <p style={{ marginTop:".25rem", fontSize:".7rem", color:"#8d967f", wordBreak:"break-all" }}>Tx {tradeReceipt.id}</p>
              {tradeReceipt.height !== null ? <p style={{ fontSize:".7rem", color:"#8d967f" }}>Block {tradeReceipt.height}</p> : null}
              <Link href={`/explorer/tx/${tradeReceipt.id}`} style={{ display:"inline-block", marginTop:".35rem", fontSize:".78rem", color:"#c8ff00" }}>Open in explorer →</Link>
            </div>
          ) : null}

          {/* Main CTA */}
          {user ? (
            <button disabled={busy || !amount} onClick={trade} style={{ width:"100%", height:"3rem", borderRadius:"1rem", border:"none", cursor: busy || !amount ? "not-allowed" : "pointer", fontWeight:700, fontSize:".95rem", transition:"all .18s ease", background: busy || !amount ? "rgba(255,255,255,.07)" : side === "buy" ? "linear-gradient(135deg,#c8ff00,#8bc900)" : "linear-gradient(135deg,#ff6b5a,#cc3a2a)", color: busy || !amount ? "#555" : side === "buy" ? "#0a0a0a" : "#fff", boxShadow: busy || !amount ? "none" : side === "buy" ? "0 4px 1.5rem rgba(200,255,0,.3)" : "0 4px 1.5rem rgba(255,107,90,.3)" }}>
              {busy ? "Submitting…" : side === "buy" ? `Buy ${coin.symbol}` : `Sell ${coin.symbol}`}
            </button>
          ) : (
            <button onClick={() => router.push(`/signin?next=/launchpad/${mint}`)} style={{ width:"100%", height:"3rem", borderRadius:"1rem", border:"1px solid rgba(200,255,0,.35)", cursor:"pointer", fontWeight:700, fontSize:".95rem", background:"rgba(200,255,0,.08)", color:"#c8ff00", transition:"all .18s ease" }}>
              Sign in to trade
            </button>
          )}

          {/* Action buttons */}
          {user ? (
            <div style={{ display:"flex", flexWrap:"wrap", gap:".45rem", marginTop:".85rem" }}>
              <button onClick={async () => { const next = await api<CoinDetail>(`/api/coins/${mint}/vote`, { method:"POST", body: JSON.stringify({ direction: coin.youVoted === 1 ? "clear" : "up" }) }); setCoin(next); }} style={{ padding:".38rem .8rem", borderRadius:".6rem", border:"1px solid rgba(200,255,0,.22)", background:"rgba(200,255,0,.06)", color:"#c8ff00", fontSize:".75rem", fontWeight:600, cursor:"pointer" }}>
                ▲ Upvote {coin.votes}
              </button>
              <button onClick={async () => { const reason = window.prompt("Reason: Scam, Spam, Impersonation, or Other"); if (!reason) return; try { await api(`/api/coins/${mint}/report`, { method:"POST", body: JSON.stringify({ reason, detail:"" }) }); toast.success("Report sent"); } catch (err) { toast.error(err instanceof Error ? err.message : "Failed."); } }} style={{ padding:".38rem .8rem", borderRadius:".6rem", border:"1px solid rgba(255,255,255,.09)", background:"rgba(255,255,255,.04)", color:"#8d967f", fontSize:".75rem", fontWeight:600, cursor:"pointer" }}>
                Report
              </button>
              {user.address === coin.creator || user.role === "admin" ? (
                <button onClick={async () => { if (!window.confirm("Promote for 50 ZCoin?")) return; try { const next = await api<CoinDetail>(`/api/coins/${mint}/promote`, { method:"POST", body: JSON.stringify({}) }); setCoin(next); toast.success("Promoted 24h"); } catch (err) { toast.error(err instanceof Error ? err.message : "Failed."); } }} style={{ padding:".38rem .8rem", borderRadius:".6rem", border:"1px solid rgba(255,215,0,.28)", background:"rgba(255,215,0,.06)", color:"#ffd700", fontSize:".75rem", fontWeight:600, cursor:"pointer" }}>
                  ⭐ Promote
                </button>
              ) : null}
            </div>
          ) : null}

          {/* Footer meta */}
          <div style={{ marginTop:"1rem", paddingTop:".85rem", borderTop:"1px solid rgba(255,255,255,.06)" }}>
            <p style={{ fontSize:".65rem", color:"#444", wordBreak:"break-all", marginBottom:".4rem" }}>Mint {coin.mint}</p>
            <CopyButton value={`${window.location.origin}/launchpad/${coin.mint}?ref=${user?.referralCode || ""}`} label="Copy share link" />
            <p style={{ marginTop:".5rem", fontSize:".72rem", color:"#8d967f" }}>Creator fees: <span style={{ color:"#c8ff00" }}>{coin.creatorFees} Z</span></p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="zendo-flex zendo-justify-between zendo-gap-3">
      <span>{k}</span>
      <span className="num zendo-text-cream">{v}</span>
    </div>
  );
}

