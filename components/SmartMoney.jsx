import { Wallet } from "lucide-react";
import TokenLogo from "./TokenLogo";

const badgeClass = { whale: "badge-whale", new: "badge-new", repeat: "badge-repeat" };

export default function SmartMoney({ flows }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Wallet size={14} color="var(--teal)" strokeWidth={2.4} />
          Smart Money
        </div>
        <span className="panel-tag" style={{ color: "var(--teal)", borderColor: "rgba(45,212,191,0.4)" }}>
          LIVE FLOW
        </span>
      </div>
      <div className="panel-body">
        {flows.length === 0 && (
          <div style={{ padding: "20px 4px", fontSize: 12.5, color: "var(--ash-dim)", textAlign: "center" }}>
            no wallets tracked · add addresses to TRACKED_WALLETS in lib/config.js
          </div>
        )}
        {flows.map((w, i) => (
          <div className="row" key={i}>
            <TokenLogo symbol={w.token} logoUrl={w.logoUrl} size={32} />
            <div className="name-col">
              <div className="sym-line mono" style={{ fontSize: 12.5 }}>
                {w.addr}
                <span className={`badge ${badgeClass[w.label] || "badge-repeat"}`}>{w.label}</span>
              </div>
              <div className="sub-line">
                {w.side === "buy" ? "bought" : "sold"} ${w.token} · {w.usd}
              </div>
            </div>
            <span
              className={w.pnl.startsWith("+") || w.pnl.startsWith("-") ? `change-pill ${w.pnl.startsWith("+") ? "change-up" : "change-down"}` : "eyebrow"}
            >
              {w.pnl}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
