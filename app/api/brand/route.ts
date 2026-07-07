import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { BRANDS } from "@/lib/data/brands";
import { DATA_AS_OF } from "@/lib/data/meta";
import { getCached, putCached } from "@/lib/server/brandCache";
import { slugifyBrand } from "@/lib/slug";
import type { Brand } from "@/lib/types";

export const maxDuration = 300;

const MAX_CONTINUATIONS = 5;

// POST { brand: string, force?: boolean }
// Live-first: cache hit → cached; else Claude + web search fetches the brand's
// current portal rates, promos and identity discounts right now. The seed
// snapshot is only served when no ANTHROPIC_API_KEY is configured.
export async function POST(req: Request) {
  const { brand: rawName, force } = (await req.json()) as {
    brand?: string;
    force?: boolean;
  };
  if (!rawName?.trim()) {
    return NextResponse.json({ error: "Missing brand" }, { status: 400 });
  }
  const name = rawName.trim();
  const id = slugifyBrand(name);
  const seeded = BRANDS.find(
    (b) => b.id === id || b.name.toLowerCase() === name.toLowerCase(),
  );

  if (!force) {
    const cached = getCached(seeded?.id ?? id);
    if (cached) {
      return NextResponse.json({
        brand: cached.brand,
        source: "cache",
        fetchedAt: cached.fetchedAt,
      });
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    if (seeded) {
      return NextResponse.json({
        brand: seeded,
        source: "snapshot",
        fetchedAt: DATA_AS_OF,
        notes:
          "No ANTHROPIC_API_KEY configured — serving the research snapshot instead of live data.",
      });
    }
    return NextResponse.json(
      {
        error: `"${name}" isn't in the snapshot set, and live lookup needs an Anthropic API key. Set ANTHROPIC_API_KEY in .env.local and restart.`,
      },
      { status: 503 },
    );
  }

  const client = new Anthropic();
  const today = new Date().toISOString().slice(0, 10);

  let messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Today is ${today}. Research CURRENT, real deal data for the US retail brand "${name}". Search the web for:

1. Cashback portal rates TODAY at exactly these three portals — check each one:
   - Rakuten (rakuten.com/<store>)
   - Capital One Shopping (capitaloneshopping.com/s/<store>)
   - TopCashback US (topcashback.com/<store>)
   If a portal doesn't cover this store, rate is null. Rates change daily — find today's number, not an old blog's.
2. Promotions running RIGHT NOW on the brand's own site: sitewide sales, promo codes, sale-section markdowns. Include the code and end date when known. Skip expired ones.
3. Identity discounts: student / military / healthcare / teacher / first-responder programs, their % and verifier (SheerID, ID.me, UNiDAYS). Mark unavailable ones as available:false.
4. App-exclusive offers, loyalty program basics, email/SMS signup discount.

Reply with your findings, ending with exactly one JSON code block:
\`\`\`json
{
  "brand": {
    "id": "${id}",
    "name": "${name}",
    "category": "beauty|athleisure|sportswear|department|electronics|luxury",
    "website": "https://…",
    "cashback": [
      {"portal": "Rakuten", "rate": 2, "notes": "…", "sourceUrl": "…", "confidence": "verified"},
      {"portal": "Capital One Shopping", "rate": null, "notes": "…", "sourceUrl": "…", "confidence": "verified"},
      {"portal": "TopCashback", "rate": 4, "notes": "…", "sourceUrl": "…", "confidence": "verified"}
    ],
    "promos": [
      {"title": "…", "description": "…", "code": null, "endsAt": null, "percentOff": null, "sourceUrl": "…"}
    ],
    "identityDiscounts": [
      {"group": "student", "available": true, "rate": "10%", "percent": 10, "verifier": "SheerID", "notes": "…", "sourceUrl": "…"},
      {"group": "military", "available": false}
    ],
    "appExclusive": {"available": false, "description": "…"},
    "loyaltyProgram": {"name": "…", "summary": "…"},
    "emailSignupOffer": {"available": true, "description": "…"}
  },
  "notes": "one short sentence of caveats"
}
\`\`\`
Rules: "rate" is a number (percent) or null. Set "percentOff" only for broadly-applicable percent-off codes. Include all three portals in "cashback" even when null. Only report what you actually verified via search; mark inferred values "confidence": "approximate". "group" must be one of student|military|healthcare|teacher|firstResponder.`,
    },
  ];

  const request = (msgs: Anthropic.MessageParam[]) =>
    client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages: msgs,
    });

  try {
    let response = await request(messages);
    for (
      let i = 0;
      response.stop_reason === "pause_turn" && i < MAX_CONTINUATIONS;
      i++
    ) {
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await request(messages);
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const parsed = extractJson(text);
    if (!parsed?.brand?.cashback) {
      return NextResponse.json(
        { error: `Live lookup for "${name}" returned no parseable data — try again or check the brand name.` },
        { status: 502 },
      );
    }

    const brand = normalize(parsed.brand, id, name);
    putCached(brand.id, brand);
    return NextResponse.json({
      brand,
      source: "live",
      fetchedAt: new Date().toISOString(),
      notes: parsed.notes,
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "Invalid ANTHROPIC_API_KEY." }, { status: 503 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited by the Claude API — try again shortly." },
        { status: 429 },
      );
    }
    const message = err instanceof Anthropic.APIError ? err.message : "Live lookup failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function extractJson(text: string): { brand: Brand; notes?: string } | null {
  const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  const raw = blocks.at(-1)?.[1];
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const CATEGORIES = new Set([
  "beauty",
  "athleisure",
  "sportswear",
  "department",
  "electronics",
  "luxury",
]);

function normalize(b: Brand, id: string, name: string): Brand {
  return {
    ...b,
    id: b.id || id,
    name: b.name || name,
    category: CATEGORIES.has(b.category) ? b.category : "department",
    cashback: (b.cashback ?? []).slice(0, 3),
    promos: b.promos ?? [],
    identityDiscounts: (b.identityDiscounts ?? []).filter((d) =>
      ["student", "military", "healthcare", "teacher", "firstResponder"].includes(
        d.group,
      ),
    ),
  };
}
