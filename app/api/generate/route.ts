import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";
import { fetchPageMetadata } from "@/lib/scrape";
import { hasActiveSubscription } from "@/lib/stripe";

const FREE_IP_LIMIT_PER_DAY = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  return realIp || "unknown";
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeLines(text: string): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim())
    .filter(Boolean)
    .filter((line) => line.length > 20)
    .slice(0, 5);

  if (lines.length === 5) {
    return lines;
  }

  const fallback = [
    "I came across your recent work and was impressed by the clarity of your positioning.",
    "Your website highlights a strong focus on outcomes, which immediately stood out.",
    "I liked how your team communicates value in a straightforward and credible way.",
    "It was clear from your online presence that you care about practical customer impact.",
    "The way your company presents its mission suggests a thoughtful, execution-focused culture.",
  ];

  return [...lines, ...fallback].slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = String(body.url || "").trim();
    const name = String(body.name || "").trim();
    const company = String(body.company || "").trim();
    const email = String(body.email || "").trim().toLowerCase();

    if (!rawUrl || !isValidHttpUrl(rawUrl)) {
      return NextResponse.json({ error: "A valid http(s) URL is required." }, { status: 400 });
    }

    let isPro = false;
    if (email) {
      try {
        isPro = await hasActiveSubscription(email);
      } catch {
        isPro = false;
      }
    }

    if (!isPro) {
      const ipKey = `generate:${getIpAddress(request)}`;
      const limit = checkRateLimit(ipKey, FREE_IP_LIMIT_PER_DAY, DAY_MS);

      if (!limit.allowed) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded for free usage. Try again tomorrow or upgrade to Pro.",
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Remaining": String(limit.remaining),
            },
          },
        );
      }
    }

    let metadata = {
      title: new URL(rawUrl).hostname,
      description: "No public description available.",
    };

    try {
      metadata = await fetchPageMetadata(rawUrl);
    } catch {
      // Continue with fallback metadata so generation still works when sites block scraping.
    }

    const systemPrompt =
      "You write highly specific, human-sounding first lines for cold emails. Keep each line to one sentence, under 25 words, and avoid hype.";

    const userPrompt = [
      "Generate exactly 5 personalized cold email opening lines based on this prospect context.",
      `Prospect URL: ${rawUrl}`,
      `Website title: ${metadata.title}`,
      `Website meta description: ${metadata.description}`,
      name ? `Prospect name: ${name}` : "",
      company ? `Company: ${company}` : "",
      "Return only 5 lines, one per line, no numbering.",
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content || "";
    const lines = normalizeLines(text);

    return NextResponse.json({
      lines,
      metadata,
      isPro,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
