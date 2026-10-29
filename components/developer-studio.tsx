"use client";
import { StudioArt } from "./reference-art";
import React from "react";

const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract ZendoToken {
  string public name = "Zendo Token";
  string public symbol = "ZET";
  uint8 public decimals = 18;
  uint256 public totalSupply;

  constructor(uint256 initialSupply) {
    totalSupply = initialSupply * 10 ** decimals;
  }
}`;

const STEPS = ["Write Contract", "Compile", "Constructor", "Deploy", "Verify"];
const TEMPLATES = [
  "Standard ERC-20 Token",
  "OpenZeppelin ERC-20 (Auto-Imports)",
  "NFT (ERC-721)",
  "Staking Contract",
  "Custom Contract (Blank)",
];
const PIPELINE = [
  { label: "Compile", status: "Success", done: true },
  { label: "Connect Wallet", status: "Connected", done: true },
  { label: "Deploy", status: "Awaiting…", done: false, active: true },
  { label: "Confirm", status: "Pending", done: false },
  { label: "Verify", status: "Pending", done: false },
];
const CONSOLE_LINES = [
  "[INFO] Compiling contracts/...",
  "[SUCCESS] Compilation successful.   [INFO] Detected constructor arguments: initialSupply (uint256)",
];

const bg = "rgba(14,20,38,.97)";
const border = "1px solid rgba(255,255,255,.1)";

export function DeveloperStudio() {
  return (
    <div style={{ display: "grid", gap: "1rem", fontFamily: "inherit" }}>

      {/* ── Hero ── */}
      <div style={{ background: bg, border, borderRadius: "1rem", padding: "1.5rem 1.75rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#c8ff00", margin: "0 0 .5rem" }}>
              Zendo L-1 Developer Studio
            </p>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0 0 .6rem", lineHeight: 1.1 }}>
              Write. Compile. Deploy. Verify.
            </h1>
            <p style={{ fontSize: ".82rem", color: "#8d967f", lineHeight: 1.65, margin: 0, maxWidth: "36rem" }}>
              A preparation workspace for contracts and constructor arguments. Execution remains disabled until Zendo L-1 EVM compatibility and the EIP-1193 ZendoWallet provider are approved.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".75rem", flexShrink: 0 }}>
            <StudioArt />
            <span style={{ fontSize: ".7rem", fontWeight: 700, padding: ".3rem .85rem", borderRadius: "999px", background: "rgba(255,200,0,.1)", color: "#ffd700", border: "1px solid rgba(255,200,0,.3)", whiteSpace: "nowrap" as const }}>
              Execution integration pending
            </span>
          </div>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: ".3rem", marginTop: "1.25rem" }}>

          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div style={{ display: "flex", alignItems: "center", gap: ".45rem", padding: ".45rem 1rem", borderRadius: ".65rem", background: i === 0 ? "linear-gradient(135deg,#c8ff00,#8bc900)" : "transparent", border: i === 0 ? "none" : border, cursor: "default" }}>
                <span style={{ display: "grid", placeItems: "center", width: "1.4rem", height: "1.4rem", borderRadius: "999px", fontSize: ".68rem", fontWeight: 800, background: i === 0 ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.08)", color: i === 0 ? "#0a0a0a" : "#8d967f" }}>{i + 1}</span>
                <span style={{ fontSize: ".8rem", fontWeight: 700, color: i === 0 ? "#0a0a0a" : "#8d967f" }}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: "2.5rem", height: "1px", background: "rgba(255,255,255,.1)", margin: "0 .1rem" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Main workspace ── */}
      <div style={{ background: bg, border, borderRadius: "1rem", overflow: "hidden", display: "grid", gridTemplateColumns: "190px minmax(0,1fr) 260px" }}>

        {/* Templates sidebar */}
        <div style={{ borderRight: border, padding: ".9rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
            <p style={{ fontWeight: 700, fontSize: ".82rem", margin: 0 }}>Contract Templates</p>
            <span style={{ fontSize: ".6rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: "999px", border, color: "#8d967f" }}>Draft</span>
          </div>
          <div style={{ display: "grid", gap: ".3rem" }}>
            {TEMPLATES.map((t, i) => (
              <button key={t} type="button" style={{ textAlign: "left" as const, padding: ".5rem .65rem", borderRadius: ".6rem", fontSize: ".73rem", fontWeight: i === 0 ? 700 : 400, border: i === 0 ? "1px solid rgba(200,255,0,.35)" : "1px solid transparent", background: i === 0 ? "linear-gradient(135deg,rgba(200,255,0,.18),rgba(139,201,0,.1))" : "transparent", color: i === 0 ? "#c8ff00" : "#8d967f", cursor: "default", width: "100%" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div style={{ borderRight: border, display: "flex", flexDirection: "column" as const }}>
          {/* Editor toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".65rem 1rem", borderBottom: border, flexWrap: "wrap" as const, gap: ".5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, padding: ".22rem .65rem", borderRadius: ".45rem", background: "rgba(200,255,0,.12)", color: "#c8ff00", border: "1px solid rgba(200,255,0,.2)" }}>Solidity</span>
              <span style={{ fontSize: ".78rem", color: "#8d967f" }}>contract.sol</span>
            </div>
            <div style={{ display: "flex", gap: ".35rem" }}>
              {["Load Template", "Clear", "Fullscreen"].map(btn => (
                <button key={btn} type="button" disabled style={{ padding: ".3rem .7rem", borderRadius: ".45rem", fontSize: ".68rem", fontWeight: 600, border, background: "rgba(255,255,255,.04)", color: "#8d967f", cursor: "not-allowed" }}>{btn}</button>
              ))}
            </div>
          </div>

          {/* Code lines */}
          <div style={{ flex: 1, overflowY: "auto" as const, padding: ".75rem 0" }}>
            {source.split("\n").map((line, i) => {
              const isComment = line.trim().startsWith("//");
              const isKeyword = /\b(contract|constructor|string|uint8|uint256|public)\b/.test(line);
              return (
                <div key={i} style={{ display: "flex", alignItems: "baseline", padding: "0 1rem", minHeight: "1.5rem" }}>
                  <span style={{ display: "inline-block", minWidth: "2rem", fontSize: ".72rem", color: "#555", fontFamily: "monospace", userSelect: "none" as const, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: ".78rem", fontFamily: "'Fira Code','Cascadia Code',monospace", lineHeight: 1.65, color: isComment ? "#8d967f" : "#c8ff00", whiteSpace: "pre" as const }}>{line}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Constructor panel */}
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column" as const }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".6rem" }}>
            <p style={{ fontWeight: 700, fontSize: ".85rem", margin: 0 }}>Constructor Arguments</p>
            <span style={{ fontSize: ".6rem", fontWeight: 700, padding: ".15rem .5rem", borderRadius: "999px", background: "rgba(200,255,0,.1)", border: "1px solid rgba(200,255,0,.3)", color: "#c8ff00" }}>✓</span>
          </div>
          <p style={{ fontSize: ".7rem", color: "#8d967f", marginBottom: ".75rem" }}>Arguments for the selected template.</p>

          <div style={{ marginBottom: ".65rem" }}>
            <label style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#8d967f", display: "block", marginBottom: ".35rem" }}>initialSupply (uint256)</label>
            <input readOnly value="1000000" style={{ width: "100%", padding: ".5rem .75rem", borderRadius: ".6rem", border, background: "rgba(255,255,255,.04)", color: "#f4f1e6", fontSize: ".82rem", outline: "none", boxSizing: "border-box" as const }} />
          </div>
          <div style={{ marginBottom: ".65rem" }}>
            <label style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#8d967f", display: "block", marginBottom: ".35rem" }}>Wallet Provider</label>
            <input readOnly value="ZendoWallet provider not detec…" style={{ width: "100%", padding: ".5rem .75rem", borderRadius: ".6rem", border: "1px solid rgba(255,107,90,.2)", background: "rgba(255,107,90,.04)", color: "#ff8577", fontSize: ".78rem", outline: "none", boxSizing: "border-box" as const }} />
          </div>

          <div style={{ marginTop: "auto", padding: ".7rem .8rem", borderRadius: ".75rem", background: "rgba(255,200,0,.05)", border: "1px solid rgba(255,200,0,.2)" }}>
            <p style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "#ffd700", margin: "0 0 .35rem" }}>Execution Pending</p>
            <p style={{ fontSize: ".7rem", color: "#8d967f", lineHeight: 1.6, margin: 0 }}>Compiler, wallet, deployment, and verification are disabled until real integrations are available.</p>
          </div>
        </div>
      </div>

      {/* ── Compile button row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button type="button" disabled style={{ flex: 1, height: "3rem", borderRadius: ".85rem", border: "none", background: "linear-gradient(135deg,rgba(200,255,0,.6),rgba(139,201,0,.5))", color: "#0a0a0a", fontWeight: 800, fontSize: ".9rem", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: ".65rem" }}>
          <span style={{ display: "grid", placeItems: "center", width: "1.5rem", height: "1.5rem", borderRadius: "999px", background: "rgba(0,0,0,.2)", fontSize: ".75rem", fontWeight: 800 }}>1</span>
          Compile Code &amp; Inspect Constructor
        </button>
        <div style={{ fontSize: "1.2rem", color: "#c8ff00", opacity: .4 }}>→</div>
        <div style={{ padding: ".6rem 1.1rem", borderRadius: ".75rem", border: "1px solid rgba(200,255,0,.2)", background: "rgba(200,255,0,.05)", fontSize: ".78rem", color: "#8d967f" }}>
          Constructor Arguments <span style={{ color: "#c8ff00", fontSize: ".6rem" }}>▼</span>
        </div>
      </div>

      {/* ── Deployment & Verification ── */}
      <div style={{ background: bg, border, borderRadius: "1rem", padding: "1rem 1.25rem" }}>
        <p style={{ fontWeight: 700, fontSize: ".85rem", margin: "0 0 1rem" }}>Deployment &amp; Verification</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          {/* Pipeline */}
          <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 0 }}>
            {PIPELINE.map((step, i) => (
              <React.Fragment key={step.label}>
                <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: ".25rem" }}>
                  <span style={{ display: "grid", placeItems: "center", width: "1.6rem", height: "1.6rem", borderRadius: "999px", fontSize: ".65rem", fontWeight: 800, background: step.done ? "linear-gradient(135deg,#c8ff00,#8bc900)" : step.active ? "rgba(200,255,0,.15)" : "rgba(255,255,255,.07)", color: step.done ? "#0a0a0a" : step.active ? "#c8ff00" : "#8d967f", border: step.active ? "2px solid rgba(200,255,0,.5)" : "none" }}>
                    {step.done ? "✓" : i + 1}
                  </span>
                  <span style={{ fontSize: ".65rem", fontWeight: 700, color: step.done ? "#c8ff00" : step.active ? "#f4f1e6" : "#8d967f", whiteSpace: "nowrap" as const }}>{step.label}</span>
                  <span style={{ fontSize: ".6rem", color: step.done ? "#8d967f" : step.active ? "#c8ff00" : "#555", whiteSpace: "nowrap" as const }}>{step.status}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div style={{ flex: 1, height: "2px", background: step.done ? "rgba(200,255,0,.35)" : "rgba(255,255,255,.07)", margin: "0 .4rem", marginTop: "-1.2rem" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Deploy button */}
          <button type="button" disabled style={{ flexShrink: 0, height: "3rem", padding: "0 1.5rem", borderRadius: ".85rem", border: "none", background: "linear-gradient(135deg,#c8ff00,#8bc900)", color: "#0a0a0a", fontWeight: 800, fontSize: ".85rem", cursor: "not-allowed", display: "flex", alignItems: "center", gap: ".6rem", boxShadow: "0 0 1.5rem rgba(200,255,0,.25)", opacity: .75 }}>
            <span style={{ fontSize: ".85rem" }}>🚀</span>
            2. Deploy via ZendoWallet
          </button>
        </div>
      </div>

      {/* ── Deployment Console ── */}
      <div style={{ background: bg, border, borderRadius: "1rem", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
          <p style={{ fontWeight: 700, fontSize: ".85rem", margin: 0 }}>Deployment Console</p>
          <button type="button" disabled style={{ fontSize: ".7rem", color: "#8d967f", background: "none", border: "none", cursor: "not-allowed" }}>Clear</button>
        </div>
        <div style={{ padding: ".85rem 1rem", borderRadius: ".75rem", background: "rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.07)", fontFamily: "'Fira Code','Cascadia Code',monospace", fontSize: ".73rem", lineHeight: 1.8 }}>
          {CONSOLE_LINES.map((line, i) => (
            <p key={i} style={{ margin: 0, color: i === 0 ? "#8d967f" : "#c8ff00" }}>{line}</p>
          ))}
        </div>
      </div>

    </div>
  );
}
