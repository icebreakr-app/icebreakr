const USER_AGENT =
  "Mozilla/5.0 (compatible; IcebreakrBot/1.0; +https://icebreakr.app)";

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractTagContent(html: string, regex: RegExp): string {
  const match = html.match(regex);
  if (!match?.[1]) {
    return "";
  }
  return cleanText(match[1]);
}

export async function fetchPageMetadata(targetUrl: string): Promise<{
  title: string;
  description: string;
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch page. Status: ${response.status}`);
    }

    const html = await response.text();
    const title = extractTagContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescription = extractTagContent(
      html,
      /<meta[^>]*(?:name=["']description["']|property=["']og:description["'])[^>]*content=["']([\s\S]*?)["'][^>]*>/i,
    );

    return {
      title: title || "Unknown Website",
      description: metaDescription || "No public description available.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
