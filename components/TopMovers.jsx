import { Flame } from "lucide-react";
import TokenLogo from "./TokenLogo";
import Sparkline from "./Sparkline";

export default function TopMovers({ movers }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Flame size={14} color="var(--amber)" strokeWidth={2.4} />
          Top Movers
        </div>
        <span className="panel-tag" style={{ color: "var(--amber)", borderColor: "rgba(255,176,32,0.4)" }}>
          24H
        </span>
      </div>
      <div className="panel-body">
        {movers.length === 0 && (
          <div style={{ padding: "20px 4px", fontSize: 12.5, color: "var(--ash-dim)", textAlign: "center" }}>
            no tokens tracked · add addresses to TRACKED_TOKENS in lib/config.js
          </div>
        )}
        {movers.map((m, i) => {
          const hasChg = typeof m.chg === "number";
          const hasSpark = Array.isArray(m.spark) && m.spark.length > 1;
          return (
            <div className="row" key={i}>
              <span className="eyebrow" style={{ width: 14, flexShrink: 0 }}>
                {i + 1}
              </span>
              <TokenLogo symbol={m.symbol} logoUrl={m.logoUrl} size={32} />
              <div className="name-col">
                <div className="sym-line">${m.symbol}</div>
                <div className="sub-line">
                  mcap {m.mcap} · vol {m.vol}
                </div>
              </div>
              {hasSpark && <Sparkline data={m.spark} color={hasChg && m.chg >= 0 ? "#00C805" : "#FF4136"} />}
              {hasChg ? (
                <span className={`change-pill ${m.chg >= 0 ? "change-up" : "change-down"}`}>
                  {m.chg >= 0 ? "+" : ""}
                  {m.chg.toFixed(1)}%
                </span>
              ) : (
                <span className="eyebrow" title="goldrush hasn't indexed historical pricing for this chain yet">
                  n/a
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
