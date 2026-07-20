// lib/blockscout.js
// fallback source for token price/mcap/volume only.
//
// robinhood-mainnet launched Jul 1 2026 and GoldRush hasn't indexed
// pricing for it yet — pricing/historical_by_addresses_v2 returns a
// hard 404 ("not found", not "no data"), and balances_v2/transactions_v3
// return null contract_ticker_symbol/quote_rate for every ERC-20 on this
// chain (verified directly against the API). Blockscout is the chain's
// official explorer (robinhoodchain.blockscout.com) and already has this
// data, so it's used here for price/mcap/vol only — balances,
// transactions, and block data all still come from goldrush. drop this
// file once GoldRush's indexers catch up.

const BASE = "https://robinhoodchain.blockscout.com/api/v2";

async function bs(path, revalidate = 30) {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`blockscout ${res.status}: ${path}`);
  return res.json();
}

export function getTokenInfo(address) {
  return bs(`/tokens/${address}`);
}

// ── incoming calls to a token-launch factory, newest first — this is
// the "new launches" firehose. robinhood-mainnet has no single
// canonical launchpad; pump.fun-style factories (see lib/config.js,
// LAUNCH_FACTORIES) get verified on Blockscout under names like
// "PonsLauncherToken" and each one's `creator_address_hash` points back
// at the factory that deployed it. revalidate faster than the default
// 30s so brand-new launches show up as close to real time as this
// dashboard's ISR window allows. ──
export function getFactoryLaunches(factoryAddress) {
  return bs(`/addresses/${factoryAddress}/transactions?filter=to`, 15);
}
