import { fmtUSD, type StackResult } from "@/lib/calc";

export function PriceStack({ stack }: { stack: StackResult }) {
  return (
    <div className="space-y-1.5">
      <ul className="space-y-1">
        {stack.steps.map((s, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3 text-xs">
            <span className={i === 0 ? "font-medium text-ink" : "text-ink-soft"}>
              {s.label}
              {s.detail && (
                <span className="ml-1 text-[10px] text-ink-soft/70">({s.detail})</span>
              )}
            </span>
            <span
              className={`font-mono ${
                s.amount < 0 ? "text-green" : "text-ink"
              }`}
            >
              {s.amount < 0 ? "−" : ""}
              {fmtUSD(Math.abs(s.amount))}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between border-t border-line pt-1.5">
        <span className="text-xs font-semibold text-ink">You pay at checkout</span>
        <span className="font-mono text-sm font-semibold text-ink">
          {fmtUSD(stack.checkout)}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-green-deep">
          True net cost (after cashback)
        </span>
        <span className="font-mono text-base font-bold text-green-deep">
          {fmtUSD(stack.net)}
        </span>
      </div>
      {stack.potentialCredits.length > 0 && (
        <ul className="space-y-0.5 pt-1">
          {stack.potentialCredits.map((c) => (
            <li key={c} className="text-[10px] leading-snug text-gold">
              ✦ {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
