// lib/liveData.js
// server-only: turns raw GoldRush responses + lib/config.js into the
// shapes the dashboard components expect. every section degrades to an
// honest empty/offline state instead of guessing at numbers.

import { getChainTip, getWalletTransactions } from "./goldrush";
import { getTokenInfo, getFactoryLaunches } from "./blockscout";
import { getTokenMarketData } from "./coingecko";
import { TRACKED_WALLETS, TRACKED_TOKENS, LAUNCH_FACTORIES } from "./config";

// only surface launches from the last hour — "new" stops meaning
// anything once a token's had all day to trade.
const NEW_LAUNCH_WINDOW_MS = 60 * 60 * 1000;

// keccak256("Transfer(address,address,uint256)") — matched against raw
// log topics because goldrush returns decoded: null for every log on
// this chain right now (its ABI/signature indexer hasn't caught up
// since the chain is brand new).
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function topicToAddress(topic) {
  return `0x${topic.slice(-40)}`;
}

function formatUsd(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

async function buildChainStats() {
  try {
    const tip = await getChainTip();
    const block = tip?.items?.[0];
    const height = tip?.chain_tip_height ?? block?.height ?? "—";
    const signedAt = block?.signed_at ? new Date(block.signed_at) : null;
    const secondsAgo = signedAt ? Math.max(0, Math.round((Date.now() - signedAt) / 1000)) : null;
    // this chain's gas_limit is 2^50 (1,125,899,906,842,624) — a
    // gas_used/gas_limit percentage rounds to "0.00%" for any real block,
    // which reads as broken/missing data even though it's mathematically
    // correct. show the raw gas used instead, which actually moves.
    const gasUsed = block?.gas_used;

    return {
      live: true,
      stats: [
        { label: "chain status", value: "LIVE", note: `robinhood-mainnet · block #${height}`, accent: "teal" },
        { label: "last block", value: secondsAgo != null ? `${secondsAgo}s ago` : "—", note: `height ${height}`, accent: "pink" },
        {
          label: "block gas used",
          value: gasUsed != null ? gasUsed.toLocaleString() : "—",
          note: block ? `limit ${block.gas_limit.toLocaleString()}` : "",
          accent: "green",
        },
        {
          label: "tracked assets",
          value: `${TRACKED_TOKENS.length} tokens · ${TRACKED_WALLETS.length} wallets`,
          note: "add addresses in lib/config.js",
          accent: "amber",
        },
      ],
    };
  } catch (err) {
    return {
      live: false,
      stats: [
        { label: "chain status", value: "OFFLINE", note: "goldrush request failed", accent: "teal" },
        { label: "last block", value: "—", note: "no connection", accent: "pink" },
        { label: "block gas used", value: "—", note: "no connection", accent: "green" },
        {
          label: "tracked assets",
          value: `${TRACKED_TOKENS.length} tokens · ${TRACKED_WALLETS.length} wallets`,
          note: "add addresses in lib/config.js",
          accent: "amber",
        },
      ],
    };
  }
}

// price/mcap/vol/24h-change/sparkline come from CoinGecko (see
// lib/coingecko.js) — these tokens are actually listed there with real
// history, unlike GoldRush (pricing 404s outright for this chain) or
// Blockscout (has mcap/vol but no historical series). CoinGecko's free
// public API rate-limits hard though, so any token that gets
// rate-limited falls back to Blockscout for mcap/vol — TopMovers.jsx
// renders "n/a" and hides the sparkline for whichever fields stay
// unavailable rather than faking them.
async function buildMoverFromToken(t) {
  try {
    const { market_data, image } = await getTokenMarketData(t.address);
    const spark = market_data.sparkline_7d?.price;
    return {
      symbol: t.symbol,
      name: t.name,
      mcap: market_data.market_cap?.usd != null ? formatUsd(market_data.market_cap.usd) : "n/a",
      vol: market_data.total_volume?.usd != null ? formatUsd(market_data.total_volume.usd) : "n/a",
      chg: typeof market_data.price_change_percentage_24h === "number" ? market_data.price_change_percentage_24h : undefined,
      spark: Array.isArray(spark) && spark.length > 1 ? spark.slice(-24) : undefined, // last 24h of hourly points
      logoUrl: image?.small,
      _sortMcap: market_data.market_cap?.usd ?? 0,
    };
  } catch (err) {
    try {
      const info = await getTokenInfo(t.address);
      const mcap = info.circulating_market_cap != null ? Number(info.circulating_market_cap) : null;
      const vol = info.volume_24h != null ? Number(info.volume_24h) : null;
      return {
        symbol: info.symbol || t.symbol,
        name: info.name || t.name,
        mcap: mcap != null ? formatUsd(mcap) : "n/a",
        vol: vol != null ? formatUsd(vol) : "n/a",
        logoUrl: info.icon_url,
        _sortMcap: mcap ?? 0,
      };
    } catch (err2) {
      return null;
    }
  }
}

async function buildMovers() {
  if (!TRACKED_TOKENS.length) return [];

  const results = await Promise.all(TRACKED_TOKENS.map(buildMoverFromToken));

  return results
    .filter(Boolean)
    .sort((a, b) => b._sortMcap - a._sortMcap)
    .map(({ _sortMcap, ...m }) => m);
}

async function buildSmartMoney() {
  if (!TRACKED_WALLETS.length) return [];

  const tokenByAddress = new Map(TRACKED_TOKENS.map((t) => [t.address.toLowerCase(), t]));
  const flows = [];

  for (const addr of TRACKED_WALLETS) {
    try {
      const data = await getWalletTransactions(addr, 10);
      for (const tx of data?.items || []) {
        for (const log of tx.log_events || []) {
          if (log.raw_log_topics?.[0] !== TRANSFER_TOPIC || log.raw_log_topics.length < 3) continue;

          const from = topicToAddress(log.raw_log_topics[1]);
          const to = topicToAddress(log.raw_log_topics[2]);
          const isBuy = to.toLowerCase() === addr.toLowerCase();
          const isSell = from.toLowerCase() === addr.toLowerCase();
          if (!isBuy && !isSell) continue;

          // the contract that emitted the log is the token contract itself —
          // only surface transfers of tokens this dashboard actually tracks,
          // otherwise every stablecoin/ETH transfer these wallets touch
          // floods the "meme tracker" panel with irrelevant noise
          const token = tokenByAddress.get(log.sender_address?.toLowerCase());
          if (!token) continue;

          const rawAmount = log.raw_log_data ? BigInt(log.raw_log_data) : 0n;
          const amount = Number(rawAmount) / 10 ** token.decimals;

          flows.push({
            addr: `${addr.slice(0, 6)}…${addr.slice(-4)}`,
            label: "tracked",
            token: token.symbol,
            side: isBuy ? "buy" : "sell",
            // goldrush doesn't return usd value_quote for this chain yet
            // (see lib/blockscout.js), so this shows the raw token
            // amount transferred instead of guessing a dollar figure
            usd: `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${token.symbol}`,
            pnl: "—", // real pnl needs cost-basis tracking goldrush doesn't provide
          });
        }
      }
    } catch (err) {
      // skip wallets goldrush can't resolve rather than failing the whole panel
    }
  }

  return flows.slice(0, 12);
}

// a launch call's decoded params carry the new token's name/symbol
// directly (see lib/config.js) — no need to chase down the deployed
// token address just to label the row.
async function buildLaunchesFromFactory(factory) {
  try {
    const data = await getFactoryLaunches(factory.address);
    const cutoff = Date.now() - NEW_LAUNCH_WINDOW_MS;

    return (data?.items || [])
      .filter((tx) => tx.status === "ok" && tx.decoded_input?.method_call?.startsWith(`${factory.method}(`))
      .map((tx) => {
        const params = tx.decoded_input.parameters?.[0]?.value;
        return {
          name: Array.isArray(params) ? params[0] : undefined,
          symbol: Array.isArray(params) ? params[1] : undefined,
          signedAt: new Date(tx.timestamp).getTime(),
          creator: tx.from?.hash,
        };
      })
      .filter((l) => l.name && l.symbol && l.signedAt >= cutoff);
  } catch (err) {
    return [];
  }
}

// nothing here proves a launch is legit or a scam — that needs social
// trust an API can't see. these only catch the sloppy, mechanical
// tells: a ticker copying a coin people already track or copying
// another launch from the same hour, and a wallet mass-producing
// tokens instead of launching one. computed against the full
// last-hour window (before the display slice below) so counts reflect
// actual activity, not just what's visible.
function tagLaunchRisks(launches) {
  const trackedSymbols = new Set(TRACKED_TOKENS.map((t) => t.symbol.toLowerCase()));
  const symbolCounts = new Map();
  const creatorCounts = new Map();

  for (const l of launches) {
    const sym = l.symbol.toLowerCase();
    symbolCounts.set(sym, (symbolCounts.get(sym) || 0) + 1);
    if (l.creator) {
      const c = l.creator.toLowerCase();
      creatorCounts.set(c, (creatorCounts.get(c) || 0) + 1);
    }
  }

  return launches.map((l) => {
    const sym = l.symbol.toLowerCase();
    const creator = l.creator?.toLowerCase();
    const flags = [];

    if (trackedSymbols.has(sym)) flags.push(`ticker matches tracked $${l.symbol}`);
    if (symbolCounts.get(sym) > 1) flags.push("duplicate ticker this hour");
    if (creator && creatorCounts.get(creator) > 1) flags.push(`same wallet launched ${creatorCounts.get(creator)}x this hour`);

    return { ...l, flags };
  });
}

async function buildNewLaunches() {
  if (!LAUNCH_FACTORIES.length) return [];

  const perFactory = await Promise.all(LAUNCH_FACTORIES.map(buildLaunchesFromFactory));
  const combined = perFactory.flat().sort((a, b) => b.signedAt - a.signedAt);
  const flagged = tagLaunchRisks(combined);

  return flagged.slice(0, 30).map((l) => {
    const secondsAgo = Math.max(0, Math.round((Date.now() - l.signedAt) / 1000));
    return {
      symbol: l.symbol,
      name: l.name,
      ago: secondsAgo < 60 ? `${secondsAgo}s` : `${Math.round(secondsAgo / 60)}m`,
      creator: l.creator ? `${l.creator.slice(0, 6)}…${l.creator.slice(-4)}` : "—",
      flags: l.flags,
    };
  });
}

export async function getLiveDashboardData() {
  const [{ live, stats }, movers, smartMoney, newLaunches] = await Promise.all([
    buildChainStats(),
    buildMovers(),
    buildSmartMoney(),
    buildNewLaunches(),
  ]);

  return { live, stats, movers, smartMoney, newLaunches };
}
