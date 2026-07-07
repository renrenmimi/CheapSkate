import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { BRANDS } from "@/lib/data/brands";
import type { Product } from "@/lib/types";

export const maxDuration = 300;

// Retailer → brand-id hints so live results can stack with our verified
// cashback/promo data for known stores.
const BRAND_HINTS = BRANDS.map((b) => `- ${b.id}: ${b.name} (${b.website})`).join(
  "\n",
);

const MAX_CONTINUATIONS = 5;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Live search needs an Anthropic API key. Set ANTHROPIC_API_KEY in .env.local and restart — until then, the app serves the research-verified snapshot dataset.",
      },
      { status: 503 },
    );
  }

  const { query } = (await req.json()) as { query?: string };
  if (!query?.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const client = new Anthropic();

  let messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Find current US prices for this product across the retailers that sell it: "${query}"

Search the web for the product's current price at each major retailer that carries it (the brand's own site plus department stores / specialty retailers like Ulta, Sephora, Macy's, Nordstrom, Best Buy, Amazon, Target where applicable). Also note any promotion currently running at each retailer that applies to it.

When a retailer matches one of these tracked stores, set "brandId" to the matching id (else omit it):
${BRAND_HINTS}

Reply with your findings, ending with exactly one JSON code block:
\`\`\`json
{
  "product": {
    "id": "kebab-case-id",
    "name": "Product Name",
    "brand": "Brand",
    "category": "beauty|apparel|electronics|other",
    "listings": [
      {"retailer": "Ulta Beauty", "brandId": "ulta", "price": 45.00, "inStock": true, "promo": "text or null", "url": "https://…", "confidence": "verified"}
    ]
  },
  "notes": "one short sentence of caveats"
}
\`\`\`
Rules: only include prices you actually found via search (mark "confidence": "approximate" if inferred from a recent source rather than the live page). Use numeric USD prices. At least 2 listings if the product is multi-retailer.`,
    },
  ];

  try {
    let response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages,
    });

    // Server-side tool loops can pause; resume until done.
    for (
      let i = 0;
      response.stop_reason === "pause_turn" && i < MAX_CONTINUATIONS;
      i++
    ) {
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        tools: [{ type: "web_search_20260209", name: "web_search" }],
        messages,
      });
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const parsed = extractJson(text);
    if (!parsed?.product?.listings?.length) {
      return NextResponse.json(
        { error: "Live search returned no parseable listings — try a more specific product name." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      product: parsed.product,
      notes: parsed.notes,
      asOf: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid ANTHROPIC_API_KEY." },
        { status: 503 },
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited by the Claude API — try again shortly." },
        { status: 429 },
      );
    }
    const message = err instanceof Anthropic.APIError ? err.message : "Live search failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function extractJson(
  text: string,
): { product: Product; notes?: string } | null {
  const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  const raw = blocks.at(-1)?.[1];
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
