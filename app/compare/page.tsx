"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePrefs } from "@/lib/prefs";
import { BRANDS } from "@/lib/data/brands";
import { CARDS } from "@/lib/data/cards";
import { PRODUCTS } from "@/lib/data/products";
import { DATA_AS_OF } from "@/lib/data/meta";
import { fmtUSD, stackPrice, type StackResult } from "@/lib/calc";
import type { CreditCard, Product, ProductListing } from "@/lib/types";
import { PriceStack } from "@/components/PriceStack";
import { SourceTag } from "@/components/SourceTag";

const BRAND_BY_ID = new Map(BRANDS.map((b) => [b.id, b]));
const CARD_BY_ID = new Map(CARDS.map((c) => [c.id, c]));

type CardMode = "best" | "none" | string;

interface RankedListing {
  listing: ProductListing;
  stack: StackResult;
  cardUsed: CreditCard | null;
}

export default function ComparePage() {
  const { prefs, loaded } = usePrefs();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cardMode, setCardMode] = useState<CardMode>("best");
  const [liveResult, setLiveResult] = useState<Product | null>(null);
  const [liveState, setLiveState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "done"; notes?: string }
  >({ status: "idle" });

  const myCards = useMemo(
    () =>
      prefs.cardIds
        .map((id) => CARD_BY_ID.get(id))
        .filter((c): c is CreditCard => Boolean(c)),
    [prefs.cardIds],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }, [query]);

  const product = liveResult ?? selected ?? (matches.length === 1 ? matches[0] : null);

  function rankListings(p: Product): RankedListing[] {
    const candidates: (CreditCard | null)[] =
      cardMode === "best"
        ? myCards.length > 0
          ? myCards
          : [null]
        : cardMode === "none"
          ? [null]
          : [CARD_BY_ID.get(cardMode) ?? null];

    return p.listings
      .map((listing) => {
        const brand = listing.brandId ? BRAND_BY_ID.get(listing.brandId) : undefined;
        let best: RankedListing | null = null;
        for (const card of candidates) {
          const stack = stackPrice({
            price: listing.price,
            brand,
            card,
            identities: prefs.identities,
          });
          if (!best || stack.net < best.stack.net) {
            best = { listing, stack, cardUsed: card };
          }
        }
        return best!;
      })
      .sort((a, b) => a.stack.net - b.stack.net);
  }

  async function runLiveSearch() {
    setLiveState({ status: "loading" });
    setLiveResult(null);
    try {
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLiveState({ status: "error", message: data.error ?? "Request failed" });
        return;
      }
      setLiveResult(data.product);
      setLiveState({ status: "done", notes: data.notes });
    } catch {
      setLiveState({ status: "error", message: "Network error — is the dev server running?" });
    }
  }

  if (!loaded) return null;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-green-deep">
          Where is it <span className="italic text-deal">actually</span> cheapest?
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Search a product to compare retailers — not just sticker price, but the
          real net cost after coupons, cashback portals, your identity discounts,
          and your credit card’s rewards.
        </p>
      </section>

      {/* Search */}
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
              setLiveResult(null);
              setLiveState({ status: "idle" });
            }}
            placeholder='Try "Chanel lip gloss", "Align pant", "AirPods"…'
            className="w-full rounded-full border border-line bg-card px-5 py-2.5 text-sm outline-none placeholder:text-ink-soft/60 focus:border-green"
          />
          <button
            onClick={runLiveSearch}
            disabled={!query.trim() || liveState.status === "loading"}
            className="shrink-0 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-deep disabled:opacity-40"
            title="Uses Claude + web search to fetch live prices (needs ANTHROPIC_API_KEY)"
          >
            {liveState.status === "loading" ? "Searching the web…" : "Live web search"}
          </button>
        </div>

        {liveState.status === "error" && (
          <p className="rounded-lg bg-deal-tint px-4 py-2 text-xs text-deal">
            {liveState.message}
          </p>
        )}
        {liveState.status === "done" && liveResult && (
          <p className="rounded-lg bg-green-tint px-4 py-2 text-xs text-green-deep">
            Live result fetched just now via web search.
            {liveState.notes ? ` ${liveState.notes}` : ""}
          </p>
        )}

        {!product && matches.length > 1 && (
          <ul className="flex flex-wrap gap-2">
            {matches.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelected(p)}
                  className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm hover:border-green"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!product && query.trim() && matches.length === 0 && (
          <p className="text-sm text-ink-soft">
            Not in the tracked catalog — hit <b>Live web search</b> to check
            prices across the web in real time.
          </p>
        )}
        {!query.trim() && (
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setQuery(p.name);
                  setSelected(p);
                }}
                className="rounded-full border border-line bg-card px-3.5 py-1.5 text-xs text-ink-soft hover:border-green hover:text-ink"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Card selector */}
      {product && (
        <section className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Paying with
          </span>
          <select
            value={cardMode}
            onChange={(e) => setCardMode(e.target.value)}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm outline-none focus:border-green"
          >
            <option value="best">
              {myCards.length > 0
                ? `Best of my ${myCards.length} card${myCards.length > 1 ? "s" : ""}`
                : "Best card (none selected)"}
            </option>
            {CARDS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.issuer} {c.name} ({c.onlineEarn.display})
              </option>
            ))}
            <option value="none">No card / cash</option>
          </select>
          {myCards.length === 0 && (
            <Link
              href="/settings"
              className="text-xs text-green underline underline-offset-2"
            >
              Add your cards to auto-pick the best one →
            </Link>
          )}
          {prefs.identities.length > 0 && (
            <span className="text-xs text-ink-soft">
              · identity discounts applied: {prefs.identities.join(", ")}
            </span>
          )}
        </section>
      )}

      {/* Results */}
      {product && <Results product={product} rank={rankListings} live={Boolean(liveResult)} />}
    </div>
  );
}

function Results({
  product,
  rank,
  live,
}: {
  product: Product;
  rank: (p: Product) => RankedListing[];
  live: boolean;
}) {
  const ranked = rank(product);
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const spread =
    winner && runnerUp ? Math.round((runnerUp.stack.net - winner.stack.net) * 100) / 100 : 0;

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {product.name}
        </h2>
        <span className="text-xs text-ink-soft">
          {live ? "live prices, just fetched" : `prices verified ${DATA_AS_OF}`}
          {spread > 0 && winner && (
            <>
              {" · "}
              <b className="text-green-deep">
                buying at {winner.listing.retailer} saves {fmtUSD(spread)}
              </b>{" "}
              vs the next best
            </>
          )}
        </span>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {ranked.map(({ listing, stack, cardUsed }, i) => (
          <article
            key={`${listing.retailer}-${i}`}
            className={`rounded-2xl border bg-card p-5 ${
              i === 0 ? "border-green shadow-[0_0_0_3px_rgba(20,104,74,0.12)]" : "border-line"
            }`}
          >
            <header className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
                  {listing.retailer}
                  {i === 0 && (
                    <span className="rounded-full bg-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Best net price
                    </span>
                  )}
                </h3>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-soft">
                  {listing.inStock === false ? (
                    <span className="text-deal">out of stock</span>
                  ) : (
                    <span>in stock</span>
                  )}
                  {listing.url && (
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-dotted underline-offset-2 hover:text-green"
                    >
                      view ↗
                    </a>
                  )}
                  <SourceTag url={listing.url} confidence={listing.confidence} />
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-green-deep">
                  {fmtUSD(stack.net)}
                </div>
                <div className="text-[10px] text-ink-soft">
                  net · sticker {fmtUSD(listing.price)}
                </div>
              </div>
            </header>

            {listing.promo && (
              <p className="mb-3 rounded-lg bg-deal-tint/60 px-3 py-1.5 text-xs text-ink">
                🏷 {listing.promo}
              </p>
            )}

            <PriceStack stack={stack} />

            {cardUsed && (
              <p className="mt-3 border-t border-line pt-2 text-[11px] text-ink-soft">
                Card used: <b>{cardUsed.issuer} {cardUsed.name}</b>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
