import type { Brand } from "../types";

// All rates/promos verified 2026-07-06 directly against portal pages and
// dated press sources (see sourceUrl on each entry). Chanel genuinely offers
// no cashback/discounts anywhere — that's real, not missing data.
export const BRANDS: Brand[] = [
  {
    id: "sephora",
    name: "Sephora",
    category: "beauty",
    website: "https://www.sephora.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 2,
        notes:
          "2% online & in-store; currently at the low end of its usual 4–8% swing. Excludes gift cards.",
        sourceUrl: "https://www.rakuten.com/sephora.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 2,
        notes: "2% base; excludes gift cards.",
        sourceUrl: "https://capitaloneshopping.com/s/sephora.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 4,
        notes: "4% flat on online purchases.",
        sourceUrl: "https://www.topcashback.com/sephora/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "30% off all Sephora Collection",
        description:
          "House-brand products only; stack code STACKUP for up to 4X Beauty Insider points.",
        code: "SAVESC",
        endsAt: "2026-07-07",
        sourceUrl:
          "https://www.facebook.com/sephora/posts/1664685672369503/",
      },
      {
        title: "Free 11-piece sample bag with $45 purchase",
        code: "MORESAMPLES",
        sourceUrl: "https://capitaloneshopping.com/s/sephora.com/coupon",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "No US student discount (Student Beans/UNiDAYS list none).",
        sourceUrl: "https://www.studentbeans.com/student-discount/us/sephora",
      },
      {
        group: "military",
        available: false,
        notes: "No permanent program; only occasional holiday promos historically.",
        sourceUrl: "https://shop.id.me/discounts/sephora/military",
      },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: true,
      description: "Periodic app-only flash deals and special offer access.",
    },
    loyaltyProgram: {
      name: "Beauty Insider",
      summary:
        "1 pt/$1; 500 pts = $10 Beauty Insider Cash (~2% back). Tiers: Insider / VIB ($350/yr) / Rouge ($1,000/yr).",
    },
    emailSignupOffer: {
      available: true,
      description: "SMS signup: 10% off next purchase (email list has no welcome code).",
    },
  },
  {
    id: "ulta",
    name: "Ulta Beauty",
    category: "beauty",
    website: "https://www.ulta.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 2,
        notes: "2% flat base rate.",
        sourceUrl: "https://www.rakuten.com/ulta.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 2,
        notes: "2% base; excludes Dior products and gift cards.",
        sourceUrl: "https://capitaloneshopping.com/s/ulta.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 4,
        notes: "4% flat on online purchases.",
        sourceUrl: "https://www.topcashback.com/ulta-beauty/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Big Summer Beauty Sale — up to 40% off",
        description:
          "June 19 – July 11: rotating weekly deals on makeup, skincare, hair; BOGO 50% on skincare/sun/body. No code needed.",
        endsAt: "2026-07-11",
        sourceUrl: "https://www.ulta.com/promotion/summer-sale",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "Ulta does not offer a student discount.",
        sourceUrl: "https://www.studentbeans.com/student-discount/us/ulta",
      },
      {
        group: "military",
        available: false,
        notes: "No permanent military program (per ID.me).",
        sourceUrl: "https://shop.id.me/discounts/ulta/military",
      },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: true,
      description:
        "App-exclusive deals and bonus-points offers activated in-app.",
      sourceUrl: "https://www.ulta.com/company/app",
    },
    loyaltyProgram: {
      name: "Ulta Beauty Rewards",
      summary:
        "~1 pt/$1 (Platinum 1.25x, Diamond 1.5x); 1,000 pts = $50, 2,000 pts = $125 — points get MORE valuable in bulk.",
    },
    emailSignupOffer: {
      available: true,
      description:
        "Joining free Rewards gives a $5 coupon; SMS signup gives 10% off (7-day code).",
    },
  },
  {
    id: "chanel",
    name: "Chanel",
    category: "luxury",
    website: "https://www.chanel.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: null,
        notes: "Rakuten explicitly shows 'No Cash Back' for Chanel.",
        sourceUrl: "https://www.rakuten.com/shop/chanel",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: null,
        notes: "Chanel does not participate in cashback programs.",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: null,
        notes: "No Chanel merchant page exists.",
        confidence: "verified",
      },
    ],
    promos: [],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "Chanel never discounts — uniform full-price positioning.",
      },
      { group: "military", available: false },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: false,
      description: "App offers try-on and advisors, but no discounts.",
    },
    loyaltyProgram: {
      name: "None (US)",
      summary:
        "No US rewards program. Tip: buy Chanel at Ulta/Macy's/Nordstrom to earn THEIR rewards + portal cashback on it.",
    },
    emailSignupOffer: { available: false },
  },
  {
    id: "lululemon",
    name: "Lululemon",
    category: "athleisure",
    website: "https://shop.lululemon.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: null,
        notes:
          "Currently 'No Cash Back' (coupons only). Rakuten runs rare short-term elevated promos (e.g. a past 15% event) — worth checking before big purchases.",
        sourceUrl: "https://www.rakuten.com/lululemon.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 2,
        notes:
          "2% back; void if you also apply a promo/discount code. Excludes gift cards & memberships.",
        sourceUrl: "https://capitaloneshopping.com/s/lululemon.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: null,
        notes:
          "No active US rate (the '6%' seen online is TopCashback UK).",
        sourceUrl: "https://www.topcashback.com/lululemon/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "We Made Too Much markdowns",
        description:
          "Restocked every Thursday; fresh early-July drops include Align leggings and Scuba hoodies up to ~57% off accessories. Prices as marked.",
        sourceUrl:
          "https://shop.lululemon.com/c/women-we-made-too-much/n16o10z8mhd",
      },
      {
        title: "Men's Summer Sale 2026",
        description: "Seasonal markdowns on shorts, tees and light layers.",
        sourceUrl:
          "https://shop.lululemon.com/c/men-we-made-too-much/n18mhdznrqw",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "No student program on the official Programs & Discounts page.",
        sourceUrl: "https://shop.lululemon.com/help/programs-and-discounts",
      },
      {
        group: "military",
        available: true,
        rate: "15%",
        percent: 15,
        verifier: "SheerID",
        notes:
          "US active/reserve/veteran/retired + spouses/dependents of active. Always-on, online & in-store; not combinable.",
        sourceUrl: "https://shop.lululemon.com/story/military-first-responder",
      },
      {
        group: "healthcare",
        available: true,
        rate: "15%",
        percent: 15,
        verifier: "SheerID",
        notes: "Doctors and licensed nurses qualify under the Military & First Responder program.",
        sourceUrl: "https://shop.lululemon.com/story/military-first-responder",
      },
      {
        group: "firstResponder",
        available: true,
        rate: "15%",
        percent: 15,
        verifier: "SheerID",
        notes: "EMTs, firefighters, law enforcement.",
        sourceUrl: "https://shop.lululemon.com/story/military-first-responder",
      },
      {
        group: "teacher",
        available: false,
        notes: "No educator discount.",
        sourceUrl: "https://shop.lululemon.com/help/programs-and-discounts",
      },
    ],
    appExclusive: {
      available: true,
      description: "App gives members exclusive/early access to product drops (no % discount).",
    },
    loyaltyProgram: {
      name: "lululemon Membership",
      summary:
        "Free; early access to drops, exchange on sale items, Peloton/Oura/Amex partner perks. Fitness pros: Sweat Collective = 25% off (SheerID).",
    },
    emailSignupOffer: {
      available: true,
      description:
        "15% off first online order of full-priced items for email signup (excludes WMTM).",
    },
  },
  {
    id: "alo-yoga",
    name: "Alo Yoga",
    category: "athleisure",
    website: "https://www.aloyoga.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 2,
        notes:
          "2% base; void on gift cards, Member-Only sales, or with unlisted coupon codes.",
        sourceUrl: "https://www.rakuten.com/aloyoga.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 2,
        notes: "2% back; some styles and gift cards excluded.",
        sourceUrl: "https://capitaloneshopping.com/s/aloyoga.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 6,
        notes:
          "6% base — best portal for Alo. Not valid on orders over $500, sale items, or with codes ALOBFFS/MEMBER.",
        sourceUrl: "https://www.topcashback.com/alo-yoga/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Unadvertised online sale — up to 40% off",
        description:
          "~100–219 styles marked 20–40% off (Alosoft leggings, bras, tennis dress). No code; sizes limited.",
        sourceUrl: "https://www.aloyoga.com/collections/womens-sale-all",
      },
      {
        title: "App-exclusive: extra 30% off sale items",
        description:
          "Applies automatically at checkout in the Alo app only (per coupon aggregators, July 2026).",
        sourceUrl: "https://couponfollow.com/site/aloyoga.com",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "No student/military/healthcare programs — official Discounts Support page lists none.",
        sourceUrl: "https://www.aloyoga.com/pages/discounts-support",
      },
      { group: "military", available: false },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: true,
      description: "Extra 30% off sale items, applied automatically in-app.",
    },
    loyaltyProgram: {
      name: "ALO Access",
      summary:
        "Free; 1 pt/$1, tiers VIP/A-List/All Access with free 2-day shipping and members-only sales. Certified instructors: Pro Program = 25% off.",
    },
    emailSignupOffer: {
      available: true,
      description: "10% off first order for newsletter signup.",
    },
  },
  {
    id: "vuori",
    name: "Vuori",
    category: "athleisure",
    website: "https://vuoriclothing.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: null,
        notes: "Listed but currently 'No Cash Back' (coupons only).",
        sourceUrl: "https://www.rakuten.com/vuoriclothing.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: null,
        notes: "Coupon codes only — no rewards rate for Vuori.",
        sourceUrl: "https://capitaloneshopping.com/s/vuoriclothing.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: null,
        notes: "Vuori is not a TopCashback US merchant.",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Sale section — up to ~40% off",
        description:
          "Ongoing men's/women's markdowns; free shipping over $75. Vuori mostly sells full-price.",
        sourceUrl: "https://vuoriclothing.com/collections/sale",
      },
      {
        title: "20% off new-customer code",
        description:
          "Active on Capital One Shopping with 7,000+ recorded uses; can't combine with other offers.",
        code: "NEWVUORI-V220",
        percentOff: 20,
        sourceUrl: "https://capitaloneshopping.com/s/vuoriclothing.com/coupon",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "No verified-group discounts; military can buy via GOVX marketplace instead.",
        sourceUrl: "https://www.studentbeans.com/student-discount/us/vuori",
      },
      { group: "military", available: false },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    loyaltyProgram: {
      name: "Vuori Birthday Rewards",
      summary:
        "Free (US); tiered birthday gift based on prior-year spend. Coaches/athletes: V1 Community = 40% off full-price (max $2k/yr).",
    },
    emailSignupOffer: {
      available: true,
      description: "20% off first purchase with email signup.",
    },
  },
  {
    id: "nike",
    name: "Nike",
    category: "sportswear",
    website: "https://www.nike.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 8,
        notes:
          "Elevated promo rate (base is usually 2%). Excludes new releases, select Jordans, SNKRS app orders, gift cards.",
        sourceUrl: "https://www.rakuten.com/nike.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 2,
        notes: "2% base; excludes SNKRS, flash sales, gift cards.",
        sourceUrl: "https://capitaloneshopping.com/s/nike.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 10,
        notes: "10% — unusually high, likely a limited-time elevated rate.",
        sourceUrl: "https://www.topcashback.com/nike/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Summer sale — up to 60% off",
        description:
          "July 4th holdover markdowns in the sale section; up to 50–60% off shoes, apparel and gear. No code.",
        sourceUrl:
          "https://www.forbes.com/sites/forbes-personal-shopper/article/nike-promo-codes/",
      },
      {
        title: "Member perks: 20% off select styles",
        description:
          "Free Nike Membership: 20% off select styles, free shipping $50+, 15% off first Nike App order.",
        sourceUrl:
          "https://www.forbes.com/sites/forbes-personal-shopper/article/nike-promo-codes/",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: true,
        rate: "10%",
        percent: 10,
        verifier: "SheerID",
        notes: "10% off most items for students 16+.",
        sourceUrl: "https://www.nike.com/help/a/student-discount",
      },
      {
        group: "military",
        available: true,
        rate: "10%",
        percent: 10,
        verifier: "SheerID",
        sourceUrl: "https://www.nike.com/help/a/student-discount",
      },
      {
        group: "healthcare",
        available: true,
        rate: "10%",
        percent: 10,
        verifier: "SheerID",
        notes: "Medical professionals qualify.",
        sourceUrl: "https://www.nike.com/help/a/student-discount",
      },
      {
        group: "teacher",
        available: true,
        rate: "10%",
        percent: 10,
        verifier: "SheerID",
        sourceUrl: "https://www.nike.com/help/a/student-discount",
      },
      {
        group: "firstResponder",
        available: true,
        rate: "10%",
        percent: 10,
        verifier: "SheerID",
        sourceUrl: "https://www.nike.com/help/a/student-discount",
      },
    ],
    appExclusive: {
      available: true,
      description: "15% off your first order in the Nike App.",
    },
    loyaltyProgram: {
      name: "Nike Membership",
      summary: "Free; member-exclusive prices, birthday 10% off, free returns.",
    },
  },
  {
    id: "adidas",
    name: "Adidas",
    category: "sportswear",
    website: "https://www.adidas.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 4,
        notes:
          "Up to 4% online (2% on Samba/Gazelle/Spezial and in-store). Excludes major collabs and Confirmed app.",
        sourceUrl: "https://www.rakuten.com/adidas.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 2,
        notes: "Up to 2% (0.5% on Sambas/Gazelles); excludes 50%+ clearance.",
        sourceUrl: "https://capitaloneshopping.com/s/adidas.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 5,
        notes: "Up to 5% (5% soccer, 4% general, 2% Samba/Gazelle).",
        sourceUrl: "https://www.topcashback.com/adidas/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Summer Savings: up to 50% off + extra 30% off",
        description:
          "Code SAVE takes an extra 30% off most full-price and sale styles. adiClub members ship free.",
        code: "SAVE",
        percentOff: 30,
        endsAt: "2026-07-06",
        sourceUrl: "https://9to5toys.com/2026/07/01/adidas-30-percent-code/",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: true,
        rate: "30%",
        percent: 30,
        verifier: "UNiDAYS",
        notes: "30% off select full-price items online (10% in-store).",
        sourceUrl: "https://www.myunidays.com/US/en-US/partners/adidas/view",
      },
      {
        group: "military",
        available: true,
        rate: "30%",
        percent: 30,
        verifier: "ID.me",
        notes: "30% online & in-store, 15% at factory outlets.",
        sourceUrl: "https://www.adidas.com/us/discount-programs",
      },
      {
        group: "healthcare",
        available: true,
        rate: "30%",
        percent: 30,
        verifier: "ID.me",
        notes: "Nurses, doctors, pharmacists, hospital employees.",
        sourceUrl: "https://www.adidas.com/us/discount-programs",
      },
      {
        group: "teacher",
        available: true,
        rate: "30%",
        percent: 30,
        verifier: "ID.me",
        notes: "Teachers, school employees, college professors.",
        sourceUrl: "https://www.adidas.com/us/discount-programs",
      },
      {
        group: "firstResponder",
        available: true,
        rate: "30%",
        percent: 30,
        verifier: "ID.me",
        notes: "Police, fire, EMT, 911 dispatchers; also seniors 65+.",
        sourceUrl: "https://www.adidas.com/us/discount-programs",
      },
    ],
    loyaltyProgram: {
      name: "adiClub",
      summary: "Free; points on purchases, member free shipping, early access.",
    },
    emailSignupOffer: {
      available: true,
      description: "15% off next order for joining adiClub / email list.",
    },
  },
  {
    id: "macys",
    name: "Macy's",
    category: "department",
    website: "https://www.macys.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 2,
        notes: "2% base ('All Other Categories'); 1.5% furniture/electronics.",
        sourceUrl: "https://www.rakuten.com/macys.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 1,
        notes:
          "Up to 1% (0.25% marketplace/furniture); many brand exclusions (Nike, Apple, Gucci…). Paid as gift cards.",
        sourceUrl: "https://capitaloneshopping.com/s/macys.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 7,
        notes:
          "Up to 7% on standard online purchases (recently boosted); 3% on marketplace/furniture/fine jewelry.",
        sourceUrl: "https://www.topcashback.com/macys/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "4th of July Sale — up to 60% off (final day)",
        description: "Extra savings with code FOURTH on already-reduced prices.",
        code: "FOURTH",
        endsAt: "2026-07-06",
        sourceUrl:
          "https://thekrazycouponlady.com/tips/store-hacks/macys-4th-of-july-sale",
      },
      {
        title: "Summer Favorites Sale",
        description: "Up to 50% off sitewide summer styles + up to 70% off clearance.",
        sourceUrl: "https://couponfollow.com/site/macys.com",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes: "No official program (UNiDAYS partner page now 404).",
        sourceUrl: "https://shop.id.me/discounts/12198-macy-s/student",
      },
      {
        group: "military",
        available: false,
        notes: "No current military discount program.",
        sourceUrl: "https://www.military.com/discounts/macys-military-discount",
      },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: true,
      description:
        "Recurring app-only promo codes (e.g. extra 20% off designer clearance in-app).",
      sourceUrl:
        "https://www.macys.com/customer-service/articles/macys-mobile-app-discount-exclusions",
    },
    loyaltyProgram: {
      name: "Macy's Star Rewards",
      summary:
        "Bronze (free) 1% back; cardholders earn 2–5%; 1,000 pts = $10 Star Money.",
    },
    emailSignupOffer: {
      available: true,
      description: "25% off next purchase for joining email + text lists.",
    },
  },
  {
    id: "nordstrom",
    name: "Nordstrom",
    category: "department",
    website: "https://www.nordstrom.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 2,
        notes: "2% flat.",
        sourceUrl: "https://www.rakuten.com/nordstrom.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: null,
        notes: "Coupons only — no rewards rate shown for Nordstrom.",
        sourceUrl: "https://capitaloneshopping.com/s/nordstrom.com/coupon",
        confidence: "approximate",
      },
      {
        portal: "TopCashback",
        rate: 2.4,
        notes: "2.4% — highest among major portals for Nordstrom.",
        sourceUrl: "https://www.topcashback.com/nordstrom/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Anniversary Sale 2026 — preview open NOW",
        description:
          "Preview opened July 6. Cardmember early access July 14–17 (by tier), public July 18 – Aug 9. Brand-new fall arrivals at limited-time prices.",
        endsAt: "2026-08-09",
        sourceUrl: "https://www.nordstrom.com/browse/anniversary-sale/details",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: false,
        notes:
          "Nordstrom offers no identity discounts and honors no third-party coupon codes.",
        sourceUrl: "https://www.nordstrom.com/browse/about/nordstrom-coupon-code",
      },
      { group: "military", available: false },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: false,
      description: "App adds convenience features, not discounts.",
    },
    loyaltyProgram: {
      name: "The Nordy Club",
      summary:
        "Free; 1 pt/$1 (3x for cardmembers), 1,000 pts = $10 Note. Cardmembers get Anniversary Sale early access (7/14–7/16 by tier).",
    },
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    category: "electronics",
    website: "https://www.bestbuy.com",
    cashback: [
      {
        portal: "Rakuten",
        rate: 1,
        notes:
          "~1% base, up to 7.5% on select categories (Chromebooks, Dyson, Bose). 0% on Apple, laptops, consoles, gift cards.",
        sourceUrl: "https://www.rakuten.com/bestbuy.com",
        confidence: "verified",
      },
      {
        portal: "Capital One Shopping",
        rate: 0.5,
        notes: "0.5%; excludes Apple, gaming hardware, digital, refurb. Paid as gift cards.",
        sourceUrl: "https://capitaloneshopping.com/s/bestbuy.com/coupon",
        confidence: "verified",
      },
      {
        portal: "TopCashback",
        rate: 2,
        notes:
          "2% base online, category boosts to 20% (Chromebooks, Shark/Ninja 12%). Excludes Apple, computers, consoles.",
        sourceUrl: "https://www.topcashback.com/best-buy/",
        confidence: "verified",
      },
    ],
    promos: [
      {
        title: "Rolling Top Deals after July 4th sale",
        description:
          "The up-to-45%-off July 4th event ended 7/5; check bestbuy.com/top-deals for current rotating deals. Black Friday in July not yet announced for 2026.",
        sourceUrl: "https://www.bestbuy.com/top-deals",
      },
    ],
    identityDiscounts: [
      {
        group: "student",
        available: true,
        rate: "deal-based",
        verifier: "Best Buy account",
        notes:
          "Student Hub offers seasonal tech deals rather than a flat % code.",
        sourceUrl: "https://couponfollow.com/site/bestbuy.com",
      },
      {
        group: "military",
        available: false,
        notes: "No corporate program; occasional in-store discretion only.",
        sourceUrl: "https://shop.id.me/discounts/2818-best-buy/military",
      },
      { group: "healthcare", available: false },
      { group: "teacher", available: false },
    ],
    appExclusive: {
      available: true,
      description:
        "Official App Exclusive Offers + Best Buy Drops (app-only savings and limited releases).",
      sourceUrl:
        "https://www.bestbuy.com/site/misc/app-exclusive-offers-list-page/pcmcat748302047114.c",
    },
    loyaltyProgram: {
      name: "My Best Buy",
      summary:
        "Free shipping (free tier); Plus/Total ($29.99/$199.99 yr) earn 1% back, stacking to 6% with the Best Buy card.",
    },
  },
];
