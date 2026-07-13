import { Rocket } from "lucide-react";
import TokenLogo from "./TokenLogo";

export default function NewLaunches({ launches }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Rocket size={14} color="var(--pink)" strokeWidth={2.4} />
          New Launches
        </div>
        <span className="panel-tag" style={{ color: "var(--pink)", borderColor: "rgba(236,72,153,0.4)" }}>
          ~11/MIN
        </span>
      </div>
      <div className="panel-body">
        {launches.length === 0 && (
          <div style={{ padding: "20px 4px", fontSize: 12.5, color: "var(--ash-dim)", textAlign: "center" }}>
            no launch factory configured · add one to LAUNCH_FACTORY in lib/config.js
          </div>
        )}
        {launches.map((l, i) => (
          <div className="row" key={i}>
            <TokenLogo symbol={l.symbol} logoUrl={l.logoUrl} size={32} />
            <div className="name-col">
              <div className="sym-line">
                ${l.symbol}
                <span className="badge badge-pink">new</span>
              </div>
              <div className="sub-line">
                {l.name} · {l.creator}
              </div>
            </div>
            <span className="eyebrow" style={{ flexShrink: 0 }}>
              {l.ago}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
