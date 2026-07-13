import { TrendingUp, Radio, Rocket, Flame } from "lucide-react";

const ICONS = { teal: TrendingUp, pink: Radio, green: Rocket, amber: Flame };
const COLORS = {
  teal: "var(--teal)",
  pink: "var(--pink)",
  green: "var(--green)",
  amber: "var(--amber)",
};

export default function StatsRow({ stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: 14,
        marginBottom: 16,
      }}
    >
      {stats.map((s, i) => {
        const Icon = ICONS[s.accent] || TrendingUp;
        return (
          <div key={i} className="panel" style={{ padding: "16px 18px 15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span className="eyebrow">{s.label}</span>
              <Icon size={15} color={COLORS[s.accent]} strokeWidth={2.2} />
            </div>
            <div
              className="mono"
              style={{ fontSize: 23, fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ash)", marginTop: 4 }}>{s.note}</div>
          </div>
        );
      })}
    </div>
  );
}
