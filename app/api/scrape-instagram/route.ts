import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export interface ScrapedPost {
  id: string;
  thumbnailUrl: string;
  caption: string;
}

const RAPIDAPI_HOST = "instagram-scraper-stable-api.p.rapidapi.com";

async function fetchFromRapidApi(username: string, paginationToken = ""): Promise<unknown> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error("RAPIDAPI_KEY environment variable is not set");

  const url = `https://${RAPIDAPI_HOST}/get_ig_user_reels.php`;

  const body = new URLSearchParams({
    username_or_url: `https://www.instagram.com/${username}`,
    amount: "20",
    pagination_token: paginationToken,
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
  console.log("RapidAPI raw response:", JSON.stringify(data, null, 2));
  return data;
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim() ?? "";
  const paginationToken = req.nextUrl.searchParams.get("pagination_token") ?? "";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({ error: "Invalid Instagram username" }, { status: 400 });
  }

  let data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    data = await fetchFromRapidApi(username, paginationToken);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json(
      { error: `Could not fetch Instagram posts: ${msg}` },
      { status: 502 }
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = (data.reels as any[]).map((reel: any) => {
      const media = reel.node.media;
      return {
        id: media.id,
        thumbnailUrl: media.image_versions2.candidates[0].url,
        caption: media.caption?.text ?? '',
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).filter((p: any) => p.id && p.thumbnailUrl);

    return NextResponse.json(
      { posts, paginationToken: data.pagination_token ?? null },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
