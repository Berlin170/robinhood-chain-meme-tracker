"use client";

import { Zap } from "lucide-react";

// the signature element: a wall street stock tape reborn as a
// meme-coin firehose. duplicated track = seamless infinite loop.

export default function TickerTape({ launches, movers }) {
  const items = [...launches, ...movers.slice(0, 4)];
  const doubled = [...items, ...items];

  if (items.length === 0) {
    return (
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 14,
          background: "linear-gradient(180deg, #0d131a, #0a0e14)",
          padding: "13px 0",
          marginBottom: 20,
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ash-dim)",
        }}
      >
        waiting for tracked tokens/wallets — configure lib/config.js to populate the tape
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        background: "linear-gradient(180deg, #0d131a, #0a0e14)",
        overflow: "hidden",
        position: "relative",
        padding: "11px 0",
        marginBottom: 20,
      }}
    >
      {/* edge fades */}
      <div style={{ position: "absolute", inset: "0 auto 0 0", width: 70, zIndex: 2, background: "linear-gradient(90deg, #0a0e14, transparent)" }} />
      <div style={{ position: "absolute", inset: "0 0 0 auto", width: 70, zIndex: 2, background: "linear-gradient(270deg, #0a0e14, transparent)" }} />

      <div
        style={{
          display: "flex",
          gap: 30,
          width: "max-content",
          animation: "tapeScroll 34s linear infinite",
        }}
      >
        {doubled.map((t, i) => {
          const isLaunch = "ago" in t;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                whiteSpace: "nowrap",
              }}
            >
              {isLaunch ? (
                <>
                  <Zap size={11} color="#EC4899" />
                  <span style={{ fontWeight: 700 }}>${t.symbol}</span>
                  <span style={{ color: "var(--ash-dim)" }}>{t.ago} ago</span>
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 700 }}>${t.symbol}</span>
                  {typeof t.chg === "number" ? (
                    <span style={{ color: t.chg >= 0 ? "var(--green)" : "var(--red)" }}>
                      {t.chg >= 0 ? "▲" : "▼"} {Math.abs(t.chg).toFixed(1)}%
                    </span>
                  ) : (
                    <span style={{ color: "var(--ash-dim)" }}>mcap {t.mcap}</span>
                  )}
                </>
              )}
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--ash-dim)" }} />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes tapeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
