// lib/coingecko.js
// CoinGecko lists robinhood-mainnet as asset platform "robinhood"
// (chain_identifier 4663) and several tracked meme tokens are already
// indexed there with real price history — richer than what GoldRush or
// Blockscout currently expose for this two-week-old chain (see
// lib/blockscout.js). used only for 24h % change and the sparkline;
// everything else still comes from GoldRush.
//
// the free public API rate-limits hard (a handful of calls/minute), so
// calls here are cached generously and lib/liveData.js falls back to
// Blockscout's mcap/vol when a request gets rate-limited.

const BASE = "https://api.coingecko.com/api/v3";

export async function getTokenMarketData(address) {
  const res = await fetch(`${BASE}/coins/robinhood/contract/${address}?sparkline=true`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`coingecko ${res.status}: ${address}`);
  const json = await res.json();
  return { market_data: json.market_data, image: json.image };
}
