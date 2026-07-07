import type { Brand, CreditCard, IdentityGroup, PortalName } from "./types";

export interface StackStep {
  label: string;
  detail?: string;
  /** Negative = money saved / returned. */
  amount: number;
}

export interface StackResult {
  sticker: number;
  /** What you actually pay at checkout (after coupons + identity discounts). */
  checkout: number;
  portalBack: number;
  cardBack: number;
  /** checkout − portalBack − cardBack: your true net cost. */
  net: number;
  steps: StackStep[];
  bestPortal?: { portal: PortalName; rate: number };
  potentialCredits: string[];
}

export function bestPortalRate(brand: Brand | undefined) {
  if (!brand) return undefined;
  let best: { portal: PortalName; rate: number } | undefined;
  for (const cb of brand.cashback) {
    if (cb.rate != null && (!best || cb.rate > best.rate)) {
      best = { portal: cb.portal, rate: cb.rate };
    }
  }
  return best;
}

export function bestIdentityDiscount(
  brand: Brand | undefined,
  identities: IdentityGroup[],
) {
  if (!brand) return undefined;
  let best: { group: IdentityGroup; percent: number; verifier?: string } | undefined;
  for (const d of brand.identityDiscounts) {
    if (!d.available || d.percent == null) continue;
    if (!identities.includes(d.group)) continue;
    if (!best || d.percent > best.percent) {
      best = { group: d.group, percent: d.percent, verifier: d.verifier };
    }
  }
  return best;
}

export function bestStackablePromo(brand: Brand | undefined) {
  if (!brand) return undefined;
  let best: { title: string; percentOff: number; code?: string | null } | undefined;
  for (const p of brand.promos) {
    if (p.percentOff == null) continue;
    if (!best || p.percentOff > best.percentOff) {
      best = { title: p.title, percentOff: p.percentOff, code: p.code };
    }
  }
  return best;
}

/**
 * Stacks price → (promo OR identity discount, whichever is larger — most US
 * retailers don't allow combining them) → portal cashback → card rewards.
 * Cashback percentages apply to the amount actually charged.
 */
export function stackPrice(opts: {
  price: number;
  brand?: Brand;
  card?: CreditCard | null;
  identities?: IdentityGroup[];
}): StackResult {
  const { price, brand, card } = opts;
  const identities = opts.identities ?? [];
  const steps: StackStep[] = [{ label: "Sticker price", amount: price }];

  const promo = bestStackablePromo(brand);
  const identity = bestIdentityDiscount(brand, identities);

  let checkout = price;
  const promoPct = promo?.percentOff ?? 0;
  const idPct = identity?.percent ?? 0;
  if (promoPct >= idPct && promoPct > 0 && promo) {
    const off = round2((price * promoPct) / 100);
    checkout = round2(price - off);
    steps.push({
      label: promo.title,
      detail: promo.code ? `code ${promo.code}` : "current promotion",
      amount: -off,
    });
  } else if (identity && idPct > 0) {
    const off = round2((price * idPct) / 100);
    checkout = round2(price - off);
    steps.push({
      label: `${idPct}% identity discount`,
      detail: identity.verifier ? `verify via ${identity.verifier}` : undefined,
      amount: -off,
    });
  }

  const portal = bestPortalRate(brand);
  const portalBack = portal ? round2((checkout * portal.rate) / 100) : 0;
  if (portal && portalBack > 0) {
    steps.push({
      label: `${portal.rate}% back via ${portal.portal}`,
      detail: "cashback portal — activate before checkout",
      amount: -portalBack,
    });
  }

  const cardBack = card
    ? round2((checkout * card.onlineEarn.effectivePercent) / 100)
    : 0;
  if (card && cardBack > 0) {
    steps.push({
      label: `${card.onlineEarn.display} on ${card.issuer} ${card.name}`,
      detail: `≈${card.onlineEarn.effectivePercent}% value at 1¢/pt`,
      amount: -cardBack,
    });
  }

  const potentialCredits: string[] = [];
  if (card && brand) {
    for (const credit of card.shoppingCredits) {
      if (
        credit.merchant.toLowerCase().includes(brand.name.toLowerCase()) ||
        brand.name.toLowerCase().includes(credit.merchant.toLowerCase())
      ) {
        potentialCredits.push(
          `$${credit.amount} ${credit.period} ${credit.merchant} credit on ${card.name} — could cover part of this purchase`,
        );
      }
    }
    potentialCredits.push(
      `Check ${card.offerProgram.name} in your app — targeted merchant offers stack on top`,
    );
  }

  return {
    sticker: price,
    checkout,
    portalBack,
    cardBack,
    net: round2(checkout - portalBack - cardBack),
    steps,
    bestPortal: portal,
    potentialCredits,
  };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function fmtUSD(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
