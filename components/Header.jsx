"use client";

import { useState } from "react";

// Logo strategy: local assets first, typographic fallback always ready.
// Drop real brand SVGs into /public/logos/ and they render automatically.
// If the file is missing or fails to load, a clean lettermark shows instead
// — never a broken-image icon.

function BrandLogo({ src, alt, size = 34, rounded = 10, letterColor = "#fff" }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: rounded,
          background: "#141b24",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: Math.round(size * 0.38),
          fontWeight: 700,
          color: letterColor,
        }}
      >
        {alt.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setBroken(true)}
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        objectFit: "cover",
      }}
    />
  );
}

export default function Header({ live = true }) {
  const color = live ? "var(--green)" : "var(--red, #FF4136)";
  const bg = live ? "rgba(0,200,5,0.08)" : "rgba(255,65,54,0.08)";
  const border = live ? "rgba(0,200,5,0.35)" : "rgba(255,65,54,0.35)";

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 0 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <BrandLogo
          src="/logos/robinhood.svg"
          alt="Robinhood"
          size={34}
          rounded={10}
        />
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Robinhood Chain
            <span
              style={{
                background: "linear-gradient(90deg, var(--teal), var(--pink))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Meme Tracker
            </span>
          </div>
          <div className="eyebrow" style={{ marginTop: 2 }}>
            L2 on Arbitrum Orbit · launched Jul 1 2026
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a
          href="https://goldrush.dev"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            color: "var(--ash)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "6px 13px 6px 7px",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <BrandLogo
            src="/logos/goldrush.svg"
            alt="GoldRush"
            size={20}
            rounded={6}
            letterColor="#00d8ff"
          />
          powered by GoldRush
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.09em",
            color,
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 999,
            padding: "6px 12px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              animation: live ? "pulseDot 1.8s ease-out infinite" : "none",
            }}
          />
          {live ? "LIVE" : "OFFLINE"}
          <style>{`
            @keyframes pulseDot {
              0% { box-shadow: 0 0 0 0 rgba(0,200,5,0.55); }
              70% { box-shadow: 0 0 0 7px rgba(0,200,5,0); }
              100% { box-shadow: 0 0 0 0 rgba(0,200,5,0); }
            }
          `}</style>
        </div>
      </div>
    </header>
  );
}
