"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePrefs } from "@/lib/prefs";
import { BRANDS } from "@/lib/data/brands";
import { BrandCard } from "@/components/BrandCard";
import type { Brand, BrandFreshness } from "@/lib/types";

const SEEDED = new Map(BRANDS.map((b) => [b.id, b]));

type CardState =
  | { status: "loading"; name: string; brand?: Brand; freshness?: BrandFreshness }
  | { status: "ready"; name: string; brand: Brand; freshness: BrandFreshness; notes?: string }
  | { status: "error"; name: string; message: string; brand?: Brand; freshness?: BrandFreshness };

export default function MyDealsPage() {
  const { prefs, loaded } = usePrefs();
  const [cards, setCards] = useState<Record<string, CardState>>({});
  const inflight = useRef(new Set<string>());

  const followed = useMemo(
    () => [
      ...prefs.favoriteBrandIds.map((id) => ({
        id,
        name: SEEDED.get(id)?.name ?? id,
      })),
      ...prefs.customBrands,
    ],
    [prefs.favoriteBrandIds, prefs.customBrands],
  );

  const fetchBrand = useCallback(async (id: string, name: string, force = false) => {
    if (inflight.current.has(id)) return;
    inflight.current.add(id);
    const snapshot = SEEDED.get(id);
    setCards((prev) => ({
      ...prev,
      [id]: {
        status: "loading",
        name,
        brand: prev[id]?.brand ?? snapshot,
        freshness: prev[id]?.freshness,
      },
    }));
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: name, force }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCards((prev) => ({
          ...prev,
          [id]: {
            status: "error",
            name,
            message: data.error ?? "Lookup failed",
            brand: snapshot,
            freshness: snapshot ? { source: "snapshot", fetchedAt: "" } : undefined,
          },
        }));
        return;
      }
      setCards((prev) => ({
        ...prev,
        [id]: {
          status: "ready",
          name,
          brand: data.brand,
          freshness: { source: data.source, fetchedAt: data.fetchedAt },
          notes: data.notes,
        },
      }));
    } catch {
      setCards((prev) => ({
        ...prev,
        [id]: {
          status: "error",
          name,
          message: "Network error — is the dev server running?",
          brand: snapshot,
          freshness: snapshot ? { source: "snapshot", fetchedAt: "" } : undefined,
        },
      }));
    } finally {
      inflight.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    for (const { id, name } of followed) {
      if (!cards[id]) void fetchBrand(id, name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, followed, fetchBrand]);

  if (!loaded) return null;
  const hasSetup = followed.length > 0;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-green-deep">
          {hasSetup ? (
            <>
              Your brands, <span className="italic text-deal">right now</span>
            </>
          ) : (
            <>
              Every discount, <span className="italic text-deal">stacked</span>
            </>
          )}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
          {hasSetup
            ? "Each card is fetched live from the web when you open this page — portal rates, running promotions, verified-group discounts — then cached briefly so refreshes stay fast. Hit ↻ on any card to force a fresh pull."
            : "Follow any brand — pick from the suggestions or type your own — and this page becomes your personal deal feed, fetched live: current promotions, Rakuten / Capital One Shopping / TopCashback rates, coupons, and student / military / healthcare discounts."}
        </p>
        {!hasSetup && (
          <div className="flex gap-3">
            <Link
              href="/settings"
              className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-deep"
            >
              Follow your brands →
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold text-green-deep transition-colors hover:border-green"
            >
              Just compare a product price
            </Link>
          </div>
        )}
      </section>

      {hasSetup && (
        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          {followed.map(({ id, name }) => {
            const state = cards[id];
            if (!state || (state.status === "loading" && !state.brand)) {
              return <SkeletonCard key={id} name={name} />;
            }
            if (state.status === "error" && !state.brand) {
              return (
                <article
                  key={id}
                  className="rounded-2xl border border-deal/40 bg-deal-tint/40 p-5"
                >
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    {state.message}
                  </p>
                  <button
                    onClick={() => fetchBrand(id, name, true)}
                    className="mt-3 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium hover:border-green"
                  >
                    Retry
                  </button>
                </article>
              );
            }
            return (
              <div key={id} className="space-y-1.5">
                <BrandCard
                  brand={state.brand!}
                  freshness={state.freshness}
                  refreshing={state.status === "loading"}
                  onRefresh={() => fetchBrand(id, name, true)}
                />
                {state.status === "error" && (
                  <p className="px-1 text-[11px] leading-snug text-deal">
                    Live fetch unavailable ({state.message}) — showing the dated
                    snapshot instead.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!hasSetup && (
        <section>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            A taste of what a followed brand looks like
          </h2>
          <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {BRANDS.slice(0, 3).map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SkeletonCard({ name }: { name: string }) {
  return (
    <article className="animate-pulse rounded-2xl border border-line bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-green-deep">
            {name}
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            searching the web for today’s deals…
          </p>
        </div>
        <span className="rounded-full bg-green-tint px-2.5 py-1 font-mono text-[10px] font-semibold text-green-deep">
          fetching…
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-paper" />
        ))}
      </div>
      <div className="mt-3 h-16 rounded-lg bg-paper" />
      <div className="mt-3 h-8 w-2/3 rounded-lg bg-paper" />
    </article>
  );
}
