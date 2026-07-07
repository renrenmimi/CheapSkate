// Core data model. All rates/discounts carry a source URL and confidence level
// because the seed data is research-verified, not invented.

export type PortalName = "Rakuten" | "Capital One Shopping" | "TopCashback";

export type Confidence = "verified" | "approximate";

export interface CashbackRate {
  portal: PortalName;
  /** Percent back, e.g. 4 = 4%. null means the portal does not cover this store. */
  rate: number | null;
  notes?: string;
  sourceUrl?: string;
  confidence: Confidence;
}

export interface Promo {
  title: string;
  description?: string;
  code?: string | null;
  endsAt?: string | null;
  sourceUrl?: string;
  /** Percent off, when the promo is a straightforward % discount usable in the calculator. */
  percentOff?: number;
}

export type IdentityGroup =
  | "student"
  | "military"
  | "healthcare"
  | "teacher"
  | "firstResponder";

export const IDENTITY_LABELS: Record<IdentityGroup, string> = {
  student: "Student",
  military: "Military & Veterans",
  healthcare: "Healthcare Workers",
  teacher: "Teachers",
  firstResponder: "First Responders",
};

export interface IdentityDiscount {
  group: IdentityGroup;
  available: boolean;
  /** e.g. "10%" */
  rate?: string;
  percent?: number;
  verifier?: string; // SheerID | UNiDAYS | ID.me | in-store
  notes?: string;
  sourceUrl?: string;
}

export type BrandCategory =
  | "beauty"
  | "athleisure"
  | "sportswear"
  | "department"
  | "electronics"
  | "luxury";

export const CATEGORY_LABELS: Record<BrandCategory, string> = {
  beauty: "Beauty",
  athleisure: "Athleisure",
  sportswear: "Sportswear",
  department: "Department Store",
  electronics: "Electronics",
  luxury: "Luxury",
};

export interface Brand {
  id: string;
  name: string;
  category: BrandCategory;
  website: string;
  cashback: CashbackRate[];
  promos: Promo[];
  identityDiscounts: IdentityDiscount[];
  appExclusive?: { available: boolean; description?: string; sourceUrl?: string };
  loyaltyProgram?: { name: string; summary: string; sourceUrl?: string };
  emailSignupOffer?: { available: boolean; description?: string };
}

export interface ShoppingCredit {
  merchant: string;
  amount: number;
  period: "monthly" | "quarterly" | "semiannual" | "annual";
  notes?: string;
  sourceUrl?: string;
}

export interface CreditCard {
  id: string;
  issuer: string;
  name: string;
  annualFee: number;
  onlineEarn: {
    display: string; // "2x miles"
    /** Conservative cash value at 1 point = 1 cent. */
    effectivePercent: number;
    notes?: string;
  };
  offerProgram: {
    name: string; // "Chase Offers"
    targeted: boolean;
    howTo: string;
    recentExamples?: string[];
    sourceUrl?: string;
  };
  shoppingCredits: ShoppingCredit[];
}

export interface ProductListing {
  retailer: string;
  /** Links this retailer to a Brand in our dataset so cashback/promos can stack. */
  brandId?: string;
  price: number;
  inStock?: boolean;
  promo?: string | null;
  url?: string;
  confidence: Confidence;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  listings: ProductListing[];
}

/** A user's local profile — this is the "customized page" state. */
export interface UserPrefs {
  favoriteBrandIds: string[];
  /** Brands the user typed in themselves — resolved live, not from the seed set. */
  customBrands: { id: string; name: string }[];
  cardIds: string[];
  identities: IdentityGroup[];
}

/** Where a brand's data came from and when. */
export interface BrandFreshness {
  source: "live" | "cache" | "snapshot";
  fetchedAt: string; // ISO timestamp (or DATA_AS_OF date for snapshots)
}

export interface BrandFetchResponse {
  brand: Brand;
  source: BrandFreshness["source"];
  fetchedAt: string;
  notes?: string;
}

export interface LiveProductResult {
  asOf: string;
  product: Product;
  notes?: string;
}
