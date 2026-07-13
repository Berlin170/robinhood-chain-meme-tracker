// lib/goldrush.js
// thin server-side client for the GoldRush API (goldrush.dev)
// all calls run server-side so the key never reaches the browser.

const BASE = "https://api.covalenthq.com/v1";
const CHAIN = process.env.NEXT_PUBLIC_CHAIN_SLUG || "robinhood-mainnet";
const KEY = process.env.GOLDRUSH_API_KEY;

async function gr(path, params = {}) {
  const url = new URL(`${BASE}/${CHAIN}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KEY}` },
    next: { revalidate: 30 }, // 30s cache — feels live without hammering quota
  });
  if (!res.ok) throw new Error(`GoldRush ${res.status}: ${path}`);
  const json = await res.json();
  return json.data;
}

// ── token balances for a wallet (includes logo_url per token) ──
export function getWalletBalances(address) {
  return gr(`/address/${address}/balances_v2/`, { "quote-currency": "USD" });
}

// ── recent transactions for a wallet, newest first ──
export function getWalletTransactions(address, pageSize = 25) {
  return gr(`/address/${address}/transactions_v3/`, {
    "page-size": pageSize,
    "block-signed-at-asc": "false",
  });
}

// ── token holders — useful for holder-growth on breakout memes ──
export function getTokenHolders(tokenAddress, pageSize = 20) {
  return gr(`/tokens/${tokenAddress}/token_holders_v2/`, {
    "page-size": pageSize,
  });
}

// ── log events by topic — this is the new-launch firehose.
// filter on the factory's TokenCreated / PairCreated topic hash. ──
export function getNewTokenEvents(factoryAddress, topicHash, pageSize = 50) {
  return gr(`/events/address/${factoryAddress}/`, {
    "starting-block": "latest",
    "page-size": pageSize,
    ...(topicHash ? { "topics": topicHash } : {}),
  });
}

// ── historical token prices for sparklines — accepts one address or
// several comma-separated. as of 2026-07-13 this 404s outright for
// robinhood-mainnet (goldrush hasn't indexed pricing for the chain yet,
// it launched Jul 1); lib/liveData.js falls back to Blockscout for
// price/mcap/vol until that changes. ──
export function getTokenPrices(tokenAddresses, days = 1) {
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return gr(`/pricing/historical_by_addresses_v2/USD/${tokenAddresses}/`, {
    from,
    to,
  });
}

// ── latest block — cheapest possible proof the chain (and our
// connection to it) is actually live ──
export function getChainTip() {
  return gr(`/block_v2/latest/`);
}
