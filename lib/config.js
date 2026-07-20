// lib/config.js
// real on-chain addresses that bring each panel live. sourced from
// robinhoodchain.blockscout.com (the chain's official explorer) on
// 2026-07-13 — verify/refresh periodically, meme rankings move fast.

// top holder wallets for CASHCAT (the largest meme token on the chain),
// filtered to real EOAs — excludes the Uniswap V3 pool contract and the
// 0x000...dEaD burn address that also show up in the raw holder list.
export const TRACKED_WALLETS = [
  "0xeb877e7b5614B1Ca58c6b00eC4FFCd248eD414ee",
  "0x4A5B304ded44a521FFeCE44A6386Fa2014d96f7D",
  "0x1caF028cD72d4cf62d7AA2d312113f3BE58458bC",
  "0xF29f0A86420399F662577b68C48137D510084d96",
  "0x9963597a9246b39b13330992F571F8378c18c262",
];

// top meme tokens by circulating market cap (excludes stablecoins,
// tokenized-stock wrappers like the "* • Robinhood Token" series, and
// non-meme DeFi tokens that also show up in the chain's token list).
export const TRACKED_TOKENS = [
  { address: "0x020bfC650A365f8BB26819deAAbF3E21291018b4", symbol: "CASHCAT", name: "Cash Cat", decimals: 18 },
  { address: "0x8e62F281f282686fCa6dCB39288069a93fC23F1c", symbol: "HOODRAT", name: "Hoodrat", decimals: 18 },
  { address: "0xA80eb66b3E0CF66ccB46f8b8C9e7ff5803eEb820", symbol: "WEN", name: "Wen Lambo", decimals: 18 },
  { address: "0xE170dC96ca10103E0D4C5d9293C5A3A72Ee365a5", symbol: "JOHN", name: "Little John", decimals: 9 },
  { address: "0x5A283986B204326344A1cC04b52b37f1af54Ef72", symbol: "CASHDOG", name: "Cash Dog in Hood", decimals: 9 },
  { address: "0x01637b14B7378B99dE75A64d50656d98488D9a4d", symbol: "MARIAN", name: "Lady Marian", decimals: 18 },
  { address: "0x8d4dFaaA4198b6486E0293Fec914C2B6a821D4DC", symbol: "KITSU", name: "Kitsu", decimals: 18 },
  { address: "0x45242320DBB855EeA8Fd36804C6487E10E97FCF9", symbol: "TENDIES", name: "TENDIES", decimals: 18 },
];

// pump.fun-style launch factories discovered on
// robinhoodchain.blockscout.com on 2026-07-20 by searching verified
// contracts for "factory"/"launch" — each one churns out a fresh
// "<Name>LauncherToken" contract every ~30-90s. `address` is the
// factory's own contract address (found via a launched token's
// `creator_address_hash`, since the factory doesn't emit its own
// "token created" event — the token's genesis mint IS the signal).
// `method` matches the decoded call name for a launch (see
// lib/liveData.js buildNewLaunches, which reads the token name/symbol
// straight out of the call's decoded params — no extra request needed).
//
// only Pons is listed: its factory is called directly by an EOA so
// every launch call decodes cleanly. ScanHood V4 also launches tokens
// on this chain (creator_address_hash 0x4271be655d27B8E4Bb5Ce4C98c6feF0678b45056)
// but its factory receives almost no direct external calls — it's
// invoked through some other contract this investigation didn't chase
// down — so its calls don't decode and it's left out rather than
// showing broken entries. revisit if that changes.
export const LAUNCH_FACTORIES = [
  { address: "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB", label: "Pons", method: "launchToken" },
];
