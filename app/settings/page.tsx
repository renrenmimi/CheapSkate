"use client";

import { useState } from "react";
import Link from "next/link";
import { usePrefs } from "@/lib/prefs";
import { BRANDS } from "@/lib/data/brands";
import { CARDS } from "@/lib/data/cards";
import { CATEGORY_LABELS, IDENTITY_LABELS, type IdentityGroup } from "@/lib/types";

const IDENTITY_OPTIONS = Object.keys(IDENTITY_LABELS) as IdentityGroup[];

export default function SettingsPage() {
  const {
    prefs,
    loaded,
    toggleBrand,
    addCustomBrand,
    removeCustomBrand,
    toggleCard,
    toggleIdentity,
    reset,
  } = usePrefs();
  const [customInput, setCustomInput] = useState("");
  if (!loaded) return null;

  const submitCustom = () => {
    if (!customInput.trim()) return;
    addCustomBrand(customInput);
    setCustomInput("");
  };

  return (
    <div className="max-w-3xl space-y-10">
      <section>
        <h1 className="font-display text-3xl font-semibold text-green-deep">
          Customize your page
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Everything is stored locally in your browser. Your picks shape the{" "}
          <Link href="/" className="text-green underline underline-offset-2">
            My Deals
          </Link>{" "}
          feed and the net-price math on{" "}
          <Link href="/compare" className="text-green underline underline-offset-2">
            Price Compare
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-1 font-display text-xl font-semibold text-ink">
          1 · Brands you shop
        </h2>
        <p className="mb-3 text-xs text-ink-soft">
          Follow <b>any</b> brand — type it below or tap a suggestion. Each one
          gets fetched live (portal cashback, current promos, group discounts)
          every time you open your deals page.
        </p>
        <div className="mb-3 flex gap-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCustom()}
            placeholder='Any brand — "Coach", "Dyson", "Abercrombie"…'
            className="w-full max-w-sm rounded-full border border-line bg-card px-4 py-2 text-sm outline-none placeholder:text-ink-soft/60 focus:border-green"
          />
          <button
            onClick={submitCustom}
            disabled={!customInput.trim()}
            className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-deep disabled:opacity-40"
          >
            + Follow
          </button>
        </div>
        {prefs.customBrands.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {prefs.customBrands.map((b) => (
              <span
                key={b.id}
                className="flex items-center gap-1.5 rounded-full border border-green bg-green px-3.5 py-1.5 text-sm font-medium text-white"
              >
                {b.name}
                <button
                  onClick={() => removeCustomBrand(b.id)}
                  className="text-white/70 hover:text-white"
                  aria-label={`Unfollow ${b.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          Suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => {
            const on = prefs.favoriteBrandIds.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleBrand(b.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-green bg-green text-white"
                    : "border-line bg-card text-ink hover:border-green"
                }`}
              >
                {b.name}
                <span
                  className={`ml-1.5 text-[10px] ${on ? "text-white/70" : "text-ink-soft"}`}
                >
                  {CATEGORY_LABELS[b.category]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 font-display text-xl font-semibold text-ink">
          2 · Your credit cards
        </h2>
        <p className="mb-3 text-xs text-ink-soft">
          Used to compute card rewards in the final net price, and to surface
          issuer offer programs and merchant credits (e.g. Amex Platinum’s
          Lululemon credit).
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {CARDS.map((c) => {
            const on = prefs.cardIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCard(c.id)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  on
                    ? "border-green bg-green-tint"
                    : "border-line bg-card hover:border-green"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {c.issuer} {c.name}
                  </span>
                  <span className="font-mono text-xs text-green">
                    {c.onlineEarn.display}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-ink-soft">
                  ≈{c.onlineEarn.effectivePercent}% online · ${c.annualFee}/yr ·{" "}
                  {c.offerProgram.name}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 font-display text-xl font-semibold text-ink">
          3 · Discounts you qualify for
        </h2>
        <p className="mb-3 text-xs text-ink-soft">
          Student, military, healthcare and similar verified-group discounts get
          folded into your net price automatically.
        </p>
        <div className="flex flex-wrap gap-2">
          {IDENTITY_OPTIONS.map((g) => {
            const on = prefs.identities.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleIdentity(g)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-green bg-green text-white"
                    : "border-line bg-card text-ink hover:border-green"
                }`}
              >
                {IDENTITY_LABELS[g]}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <Link
          href="/"
          className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-deep"
        >
          See my deals →
        </Link>
        <button
          onClick={reset}
          className="text-xs text-ink-soft underline underline-offset-2 hover:text-deal"
        >
          Reset everything
        </button>
      </div>
    </div>
  );
}
