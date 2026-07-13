"use client";

import { useState } from "react";

// renders a real token logo when GoldRush gives us a logo_url,
// and falls back to a deterministic gradient monogram when it
// doesn't (fresh meme launches usually have no logo yet).

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

export default function TokenLogo({ symbol, logoUrl, size = 34 }) {
  const [broken, setBroken] = useState(false);
  const hue = hashHue(symbol || "?");
  const hue2 = (hue + 46) % 360;

  if (logoUrl && !broken) {
    return (
      <img
        src={logoUrl}
        alt={symbol}
        width={size}
        height={size}
        onError={() => setBroken(true)}
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          objectFit: "cover",
          flexShrink: 0,
          background: "#141b24",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: `linear-gradient(135deg, hsl(${hue} 75% 45%), hsl(${hue2} 70% 30%))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: size * 0.34,
        color: "rgba(255,255,255,0.92)",
        flexShrink: 0,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      {(symbol || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}
