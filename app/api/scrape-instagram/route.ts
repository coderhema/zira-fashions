import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export interface ScrapedPost {
  id: string;
  thumbnailUrl: string;
  caption: string;
}

const RAPIDAPI_HOST = "instagram-scraper-api2.p.rapidapi.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractItems(items: any[]): ScrapedPost[] {
  return items
    .map((item) => {
      const id = String(item.id ?? item.pk ?? "");

      // Prefer the first candidate of image_versions2, fall back to thumbnail_url / display_url
      const thumbnailUrl = String(
        item.image_versions2?.candidates?.[0]?.url ??
        item.thumbnail_url ??
        item.display_url ??
        // carousel: use cover image
        item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ??
        ""
      );

      const caption = String(item.caption?.text ?? "");

      return { id, thumbnailUrl, caption };
    })
    .filter((p) => p.id && p.thumbnailUrl);
}

async function fetchFromRapidApi(username: string): Promise<ScrapedPost[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error("RAPIDAPI_KEY environment variable is not set");

  const url = `https://${RAPIDAPI_HOST}/v1/posts?username_or_id_or_url=${encodeURIComponent(username)}`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`RapidAPI responded with HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();

  // The API returns { data: { items: [...] } }
  const items: unknown[] =
    data?.data?.items ??
    data?.items ??
    [];

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No posts found in RapidAPI response");
  }

  return extractItems(items);
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim() ?? "";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({ error: "Invalid Instagram username" }, { status: 400 });
  }

  try {
    const posts = await fetchFromRapidApi(username);
    return NextResponse.json({ posts }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json(
      { error: `Could not fetch Instagram posts: ${msg}` },
      { status: 502 }
    );
  }
}
