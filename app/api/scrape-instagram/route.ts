import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export interface ScrapedPost {
  id: string;
  thumbnailUrl: string;
  caption: string;
}

const RAPIDAPI_HOST = "instagram-scraper-stable-api.p.rapidapi.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractItems(items: any[]): ScrapedPost[] {
  return items
    .map((item) => {
      const id = String(item.id ?? item.pk ?? "");
      const thumbnailUrl = String(item.image_versions2?.candidates?.[0]?.url ?? "");
      const caption = String(item.caption?.text ?? "");

      return { id, thumbnailUrl, caption };
    })
    .filter((p) => p.id && p.thumbnailUrl);
}

async function fetchFromRapidApi(username: string): Promise<ScrapedPost[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error("RAPIDAPI_KEY environment variable is not set");

  const url = `https://${RAPIDAPI_HOST}/get_ig_user_reels.php`;

  const body = new URLSearchParams({
    username_or_url: `https://www.instagram.com/${username}`,
    amount: "20",
    pagination_token: "",
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
    body: body.toString(),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RapidAPI responded with HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();

  const items: unknown[] =
    data?.data?.items ??
    data?.items ??
    [];

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No reels found in RapidAPI response");
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
