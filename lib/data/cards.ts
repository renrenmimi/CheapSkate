import type { CreditCard } from "../types";

// Verified 2026-07-06 against issuer pages + points/miles press.
// effectivePercent uses a conservative 1 point = 1 cent; transferable points
// (Chase UR, Amex MR, Capital One miles) can be worth ~2x via travel partners.
// Notable recent facts baked in: Amex Platinum's Saks credit ended 2026-07-01
// (excluded); its Lululemon $75/quarter credit (added Sept 2025) is active.
export const CARDS: CreditCard[] = [
  {
    id: "amex-blue-cash-everyday",
    issuer: "Amex",
    name: "Blue Cash Everyday",
    annualFee: 0,
    onlineEarn: {
      display: "3% online retail",
      effectivePercent: 3,
      notes:
        "3% on U.S. online retail purchases up to $6,000/yr (then 1%). Best mainstream no-fee card for online shopping.",
    },
    offerProgram: {
      name: "Amex Offers",
      targeted: true,
      howTo: "Add offers manually in the Amex app before purchasing.",
      recentExamples: ["Lululemon: $25 back on $100+ (targeted, ran through May 2026)"],
    },
    shoppingCredits: [],
  },
  {
    id: "boa-customized-cash",
    issuer: "Bank of America",
    name: "Customized Cash Rewards",
    annualFee: 0,
    onlineEarn: {
      display: "3% online shopping*",
      effectivePercent: 3,
      notes:
        "3% requires selecting 'Online Shopping' as your choice category; $2,500/quarter combined cap. Preferred Rewards boosts to up to 5.25%.",
    },
    offerProgram: {
      name: "BankAmeriDeals",
      targeted: true,
      howTo: "Activate each deal in the BofA app, then pay with the card.",
      recentExamples: ["Nike and Under Armour cash-back deals have been featured"],
    },
    shoppingCredits: [],
  },
  {
    id: "citi-double-cash",
    issuer: "Citi",
    name: "Double Cash",
    annualFee: 0,
    onlineEarn: {
      display: "2% everything",
      effectivePercent: 2,
      notes: "1% when you buy + 1% when you pay, no caps.",
    },
    offerProgram: {
      name: "Citi Merchant Offers",
      targeted: true,
      howTo: "Enroll in each offer in the Citi app before purchasing.",
      recentExamples: ["Stop & Shop 15% back (through June 2026)"],
    },
    shoppingCredits: [],
  },
  {
    id: "capital-one-venture-x",
    issuer: "Capital One",
    name: "Venture X",
    annualFee: 395,
    onlineEarn: {
      display: "2x miles",
      effectivePercent: 2,
      notes:
        "2x miles on everything ≈ 2% toward travel at 1¢/mile; more via transfer partners.",
    },
    offerProgram: {
      name: "Capital One Offers",
      targeted: true,
      howTo:
        "Click through the offer tile in the Capital One app/site before buying online.",
      recentExamples: [
        "2026 promo: $10 / 1,000 pts on $20+ at Adidas, Ulta, Macy's, Chewy, eBay",
      ],
    },
    shoppingCredits: [],
  },
  {
    id: "capital-one-venture",
    issuer: "Capital One",
    name: "Venture",
    annualFee: 95,
    onlineEarn: {
      display: "2x miles",
      effectivePercent: 2,
      notes: "Unlimited 2x miles on all purchases ≈ 2% at 1¢/mile.",
    },
    offerProgram: {
      name: "Capital One Offers",
      targeted: true,
      howTo:
        "Click through the offer tile in the Capital One app/site before buying online.",
      recentExamples: ["2026 promo: $10 / 1,000 pts on $20+ at Adidas, Ulta, Macy's"],
    },
    shoppingCredits: [],
  },
  {
    id: "chase-freedom-unlimited",
    issuer: "Chase",
    name: "Freedom Unlimited",
    annualFee: 0,
    onlineEarn: {
      display: "1.5% everything",
      effectivePercent: 1.5,
      notes:
        "Flat 1.5% on non-bonus spend; pool with a Sapphire to make points transferable (~2¢/pt).",
    },
    offerProgram: {
      name: "Chase Offers",
      targeted: true,
      howTo: "Add offers to your card in the Chase app before purchasing.",
      recentExamples: ["QVC 10% back, HP 8% back on $500+ (July 2026)"],
    },
    shoppingCredits: [],
  },
  {
    id: "chase-sapphire-reserve",
    issuer: "Chase",
    name: "Sapphire Reserve",
    annualFee: 795,
    onlineEarn: {
      display: "1x points",
      effectivePercent: 1,
      notes:
        "Post-2025 refresh, non-travel/dining spend earns 1x. Points worth ~2x via transfer partners.",
    },
    offerProgram: {
      name: "Chase Offers",
      targeted: true,
      howTo: "Add offers to your card in the Chase app before purchasing.",
      recentExamples: ["Sony Electronics 20% back up to $50 (July 2026)"],
    },
    shoppingCredits: [
      {
        merchant: "The Shops at Chase",
        amount: 250,
        period: "annual",
        notes: "Unlocked only after $75k/yr spend — most cardholders won't get it.",
      },
    ],
  },
  {
    id: "chase-sapphire-preferred",
    issuer: "Chase",
    name: "Sapphire Preferred",
    annualFee: 95,
    onlineEarn: {
      display: "1x points",
      effectivePercent: 1,
      notes:
        "General retail earns 1x (June 2026 refresh kept $95 fee). ~2¢/pt via transfer partners.",
    },
    offerProgram: {
      name: "Chase Offers",
      targeted: true,
      howTo: "Add offers to your card in the Chase app before purchasing.",
      recentExamples: ["Sony 20% back, eBay 10% back (July 2026)"],
    },
    shoppingCredits: [],
  },
  {
    id: "amex-platinum",
    issuer: "Amex",
    name: "Platinum",
    annualFee: 895,
    onlineEarn: {
      display: "1x points",
      effectivePercent: 1,
      notes:
        "General purchases earn 1x MR (~1% at 1¢/pt, ~2% via transfers). Fee rose to $895 in the Sept 2025 refresh.",
    },
    offerProgram: {
      name: "Amex Offers",
      targeted: true,
      howTo:
        "Add offers in the Amex app. Note: the Saks credit ended 2026-07-01 — Amex is substituting exclusive retail Amex Offers instead.",
      recentExamples: ["Lululemon $25 back on $100+ (targeted, through May 2026)"],
    },
    shoppingCredits: [
      {
        merchant: "Lululemon",
        amount: 75,
        period: "quarterly",
        notes:
          "Up to $75/quarter ($300/yr) at U.S. Lululemon stores, site or app. Added Sept 2025; enrollment required.",
        sourceUrl:
          "https://shop.lululemon.com/help/programs-and-discounts/amex-benefits",
      },
    ],
  },
  {
    id: "amex-gold",
    issuer: "Amex",
    name: "Gold",
    annualFee: 325,
    onlineEarn: {
      display: "1x points",
      effectivePercent: 1,
      notes: "4x is dining/groceries only; general online retail earns 1x.",
    },
    offerProgram: {
      name: "Amex Offers",
      targeted: true,
      howTo: "Add offers in the Amex app before purchasing.",
      recentExamples: ["Lululemon $25 back on $100+ (targeted)"],
    },
    shoppingCredits: [],
  },
  {
    id: "chase-freedom-flex",
    issuer: "Chase",
    name: "Freedom Flex",
    annualFee: 0,
    onlineEarn: {
      display: "1% (5% rotating)",
      effectivePercent: 1,
      notes:
        "Online retail earns 1% unless in the activated 5% quarterly category (Q3 2026: gas/transit — no online retail).",
    },
    offerProgram: {
      name: "Chase Offers",
      targeted: true,
      howTo: "Add offers to your card in the Chase app before purchasing.",
      recentExamples: ["Sony 20% back up to $50 (July 2026)"],
    },
    shoppingCredits: [],
  },
  {
    id: "discover-it",
    issuer: "Discover",
    name: "it Cash Back",
    annualFee: 0,
    onlineEarn: {
      display: "1% (5% rotating)",
      effectivePercent: 1,
      notes:
        "Q3 2026 5% categories are gas/transit/drugstores. First-year Cashback Match doubles everything. No merchant-offer program.",
    },
    offerProgram: {
      name: "None",
      targeted: false,
      howTo: "Discover Deals was retired in 2018; no card-linked offers today.",
      recentExamples: [],
    },
    shoppingCredits: [],
  },
];
