# CheapSkate

A personal deal-comparison prototype for estimating a product's net price after promotions, cashback, coupons, identity discounts, and card rewards.

Deal data changes frequently. Results are intended as a starting point and should be confirmed with the retailer, portal, and card issuer before purchase.

![The deal feed with promotions and card offers](docs/cheapskate.jpg)

## Features

- **My Deals** — follows selected brands and presents promotions, portal rates, identity discounts, and card offers in one feed.
- **Price Compare** — estimates net cost across retailers after eligible discounts and rewards.
- **Personal settings** — stores preferred brands, cards, and discount groups locally in the browser.
- **Optional live lookup** — uses the Anthropic API and web search when configured; otherwise it falls back to the included research snapshot.
- **Source context** — records source links, freshness, and confidence where available.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # optional: add ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000
```

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, and the Anthropic SDK. User preferences are stored in `localStorage`.

## Limitations

- Promotions and rewards may be targeted, account-specific, delayed, or unavailable by the time they are shown.
- Net prices are estimates rather than checkout guarantees.
- The included snapshot is dated; live lookup is available only when an API key is configured.

