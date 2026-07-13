# robinhood chain meme tracker

live board of new token launches, top movers, and smart money flows on robinhood chain — built on the [GoldRush API](https://goldrush.dev).

## quick start

```bash
npm install
cp .env.example .env.local   # add your GoldRush key
npm run dev
```

deploys as-is on vercel. add `GOLDRUSH_API_KEY` and `NEXT_PUBLIC_CHAIN_SLUG` in project settings.

## live data

`app/page.js` is an async server component that calls `lib/liveData.js`, which pulls from three real APIs. Chain status, last-block time, and gas usage come straight from GoldRush (`lib/goldrush.js`) and are always genuinely live — no address configuration needed.

The other three panels need real on-chain addresses, which vary per deployment and aren't guessable, so they render an honest "not configured" empty state until you add them to `lib/config.js`. `lib/config.js` currently ships with real addresses found via [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) (the chain's official explorer) as a working example — refresh them periodically, meme rankings move fast:

- **new launches** → set `LAUNCH_FACTORY = { address, topic }` to a token factory contract and its creation-event topic hash. none is configured: the meme tokens checked so far were each deployed by a distinct address rather than a shared pump.fun-style factory, so there's nothing to point this at yet.
- **top movers** → add token contracts to `TRACKED_TOKENS`. price, market cap, 24h volume, 24h change, and a 24h sparkline all come from CoinGecko (`lib/coingecko.js`), which has these tokens indexed under asset platform `robinhood`. GoldRush's own pricing endpoint 404s outright for this chain right now (too new — launched Jul 1 2026), so if CoinGecko's aggressive free-tier rate limit kicks in, that token falls back to Blockscout for mcap/volume only (no change/sparkline) rather than showing fabricated numbers.
- **smart money** → add wallet addresses to `TRACKED_WALLETS`. buy/sell flows are parsed from raw ERC-20 Transfer log topics in GoldRush transaction data (GoldRush returns `decoded: null` for every log on this chain, so decoded params aren't usable yet). shows the real token amount transferred rather than a USD figure, since GoldRush doesn't return `value_quote` for this chain either. PnL shows `—` since it needs cost-basis tracking no available API provides.

every GoldRush token item includes a `logo_url`, passed through as `logoUrl` — real token logos render automatically (gradient monogram fallback covers logo-less fresh launches).

## structure

```
app/            layout, page, global design system
components/     Header, TickerTape, StatsRow, NewLaunches, TopMovers, SmartMoney, TokenLogo, Sparkline
lib/            goldrush.js, blockscout.js, coingecko.js (api clients), liveData.js (assembles live data), config.js (addresses to track)
public/logos/   brand marks (local assets, no external logo CDN)
```

## logos

### brand marks (header)

Partner brand logos live as **local SVG files** in `/public/logos/`:

| file | usage | fallback |
|------|-------|----------|
| `public/logos/robinhood.svg` | header left lockup | clean "R" lettermark |
| `public/logos/goldrush.svg`  | header "powered by" badge | clean "G" lettermark |

**Why local?** Hotlinking a third-party logo CDN (e.g. Clearbit) is blocked by many ad blockers and privacy extensions (uBlock, Brave Shields, browser privacy lists). Local assets render reliably in every environment.

**To upgrade to real brand logos:** download the official SVG brand assets from [Robinhood's press/brand page](https://robinhood.com/us/en/about/press/) and [GoldRush's brand kit](https://goldrush.dev), drop them into `public/logos/`, keeping the same filenames. The component auto-detects and loads them; if a file is missing or fails, it shows an intentional typographic fallback — no broken-image icons ever.

### token logos (cards & tables)

token logos come from GoldRush `logo_url` fields (fetched at runtime). nothing is redrawn or AI-generated, and everything has a graceful gradient-monogram fallback for fresh launches that don't have a logo yet.

### image domains

next.js `images.remotePatterns` is configured for token/logo CDN hosts only (`logos.covalenthq.com`, `datocms-assets.com`, `assets.coingecko.com`). no external brand-mark domains are required.
