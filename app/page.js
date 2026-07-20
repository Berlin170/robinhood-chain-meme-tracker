import Header from "../components/Header";
import TickerTape from "../components/TickerTape";
import StatsRow from "../components/StatsRow";
import NewLaunches from "../components/NewLaunches";
import TopMovers from "../components/TopMovers";
import SmartMoney from "../components/SmartMoney";
import { getLiveDashboardData } from "../lib/liveData";

// re-fetch chain data at most every 15s — fast enough that new launch
// factory calls (lib/blockscout.js getFactoryLaunches, cached 15s) show
// up close to real time without hammering the underlying APIs.
export const revalidate = 15;

export default async function Page() {
  const { live, stats, movers, smartMoney, newLaunches } = await getLiveDashboardData();

  return (
    <main className="shell">
      <Header live={live} />
      <TickerTape launches={newLaunches} movers={movers} />
      <StatsRow stats={stats} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 14,
        }}
      >
        <NewLaunches launches={newLaunches} />
        <TopMovers movers={movers} />
        <SmartMoney flows={smartMoney} />
      </div>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 20,
          fontSize: 11,
          color: "var(--ash-dim)",
        }}
      >
        <span>{live ? "connected · live block data from goldrush.dev" : "goldrush request failed · check GOLDRUSH_API_KEY in .env"}</span>
        <span className="mono">data via goldrush.dev · robinhood-mainnet</span>
      </footer>
    </main>
  );
}
