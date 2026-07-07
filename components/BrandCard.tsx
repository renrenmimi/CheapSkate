import type { Brand, BrandFreshness } from "@/lib/types";
import { CATEGORY_LABELS, IDENTITY_LABELS } from "@/lib/types";
import { DATA_AS_OF } from "@/lib/data/meta";
import { SourceTag } from "./SourceTag";

export function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function freshnessBadge(f?: BrandFreshness) {
  if (!f || f.source === "snapshot") {
    return {
      text: `snapshot · ${DATA_AS_OF}`,
      cls: "bg-paper text-ink-soft border border-line",
      entryLabel: undefined as string | undefined,
    };
  }
  if (f.source === "live") {
    return {
      text: `● live · ${timeAgo(f.fetchedAt)}`,
      cls: "bg-green text-white",
      entryLabel: `live · ${timeAgo(f.fetchedAt)}`,
    };
  }
  return {
    text: `cached · ${timeAgo(f.fetchedAt)}`,
    cls: "bg-green-tint text-green-deep",
    entryLabel: `fetched ${timeAgo(f.fetchedAt)}`,
  };
}

export function BrandCard({
  brand,
  freshness,
  onRefresh,
  refreshing,
}: {
  brand: Brand;
  freshness?: BrandFreshness;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const availableIds = brand.identityDiscounts.filter((d) => d.available);
  const best = brand.cashback.reduce<number>(
    (m, c) => (c.rate != null && c.rate > m ? c.rate : m),
    0,
  );
  const badge = freshnessBadge(freshness);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(28,43,36,0.05)]">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-green-deep">
            {brand.name}
          </h3>
          <p className="text-xs text-ink-soft">
            {CATEGORY_LABELS[brand.category]} ·{" "}
            <a
              href={brand.website}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-green"
            >
              {brand.website?.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${badge.cls}`}
          >
            {badge.text}
          </span>
          <div className="flex items-center gap-1.5">
            {best > 0 && (
              <span className="rounded-full bg-gold-tint px-2.5 py-1 font-mono text-xs font-semibold text-gold">
                up to {best}% back
              </span>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                title="Re-fetch this brand's deals from the web right now"
                className="rounded-full border border-line bg-paper px-2 py-1 text-[10px] font-medium text-ink-soft transition-colors hover:border-green hover:text-green disabled:opacity-40"
              >
                {refreshing ? "…" : "↻"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Cashback portals */}
      <div>
        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          Cashback portals
        </h4>
        <ul className="grid grid-cols-3 gap-2">
          {brand.cashback.map((cb) => (
            <li
              key={cb.portal}
              className="rounded-lg border border-line bg-paper px-2 py-1.5 text-center"
              title={cb.notes}
            >
              <div
                className={`font-mono text-sm font-semibold ${
                  cb.rate ? "text-green" : "text-ink-soft/50"
                }`}
              >
                {cb.rate ? `${cb.rate}%` : "—"}
              </div>
              <div className="truncate text-[10px] text-ink-soft">{cb.portal}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Current promos */}
      {brand.promos.length > 0 && (
        <div>
          <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            Live deals
          </h4>
          <ul className="space-y-2">
            {brand.promos.map((p) => (
              <li key={p.title} className="rounded-lg bg-deal-tint/60 px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-ink">{p.title}</span>
                  {p.code && (
                    <code className="shrink-0 rounded bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-deal">
                      {p.code}
                    </code>
                  )}
                </div>
                {p.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">
                    {p.description}
                  </p>
                )}
                <div className="mt-1 flex items-center justify-between">
                  {p.endsAt ? (
                    <span className="text-[10px] font-medium text-deal">
                      ends {p.endsAt}
                    </span>
                  ) : (
                    <span className="text-[10px] text-ink-soft/70">ongoing</span>
                  )}
                  <SourceTag url={p.sourceUrl} label={badge.entryLabel} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Identity discounts */}
      <div>
        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          Who saves extra
        </h4>
        {availableIds.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {availableIds.map((d) => (
              <li
                key={d.group}
                className="rounded-full bg-green-tint px-2.5 py-1 text-[11px] font-medium text-green-deep"
                title={`${d.notes ?? ""}${d.verifier ? ` (verify via ${d.verifier})` : ""}`}
              >
                {IDENTITY_LABELS[d.group]} {d.rate && <b>{d.rate}</b>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-ink-soft/70">
            No student / military / healthcare discounts.
          </p>
        )}
      </div>

      {/* Extras */}
      <footer className="mt-auto space-y-1 border-t border-line pt-3 text-xs text-ink-soft">
        {brand.appExclusive?.available && (
          <p>📱 {brand.appExclusive.description ?? "App-exclusive offers available."}</p>
        )}
        {brand.emailSignupOffer?.available && (
          <p>✉️ {brand.emailSignupOffer.description ?? "Email signup discount."}</p>
        )}
        {brand.loyaltyProgram && (
          <p>
            ★ {brand.loyaltyProgram.name}: {brand.loyaltyProgram.summary}
          </p>
        )}
      </footer>
    </article>
  );
}
