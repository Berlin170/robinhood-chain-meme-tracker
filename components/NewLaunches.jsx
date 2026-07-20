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
          {launches.length} IN 60M
        </span>
      </div>
      <div className="panel-body">
        {launches.length === 0 && (
          <div style={{ padding: "20px 4px", fontSize: 12.5, color: "var(--ash-dim)", textAlign: "center" }}>
            no launches in the last hour · add a factory to LAUNCH_FACTORIES in lib/config.js
          </div>
        )}
        {launches.map((l, i) => (
          <div className="row" key={i}>
            <TokenLogo symbol={l.symbol} logoUrl={l.logoUrl} size={32} />
            <div className="name-col">
              <div className="sym-line">
                ${l.symbol}
                <span className="badge badge-pink">new</span>
                {l.flags?.length > 0 && (
                  <span className="badge badge-risk" title={l.flags.join(" · ")}>
                    ⚠ risk
                  </span>
                )}
              </div>
              <div className="sub-line">
                {l.name} · {l.creator}
                {l.flags?.length > 0 && <span style={{ color: "var(--red)" }}> · {l.flags[0]}</span>}
              </div>
              <div className="sub-line mono" style={{ fontSize: 11 }}>
                {l.blockscoutUrl ? (
                  <a href={l.blockscoutUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ash-dim)" }}>
                    {l.addressShort} ↗
                  </a>
                ) : (
                  <span style={{ color: "var(--ash-dim)" }}>contract address unresolved</span>
                )}
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
