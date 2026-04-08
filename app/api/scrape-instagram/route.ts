import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export interface ScrapedPost {
  id: string;
  thumbnailUrl: string;
  caption: string;
}

const IG_HEADERS: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.instagram.com/",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractEdges(edges: any[]): ScrapedPost[] {
  return edges
    .map((edge) => {
      const node = edge?.node ?? edge;
      return {
        id: String(node.id ?? node.pk ?? ""),
        thumbnailUrl: String(
          node.thumbnail_src ?? node.display_url ?? node.image_versions2?.candidates?.[0]?.url ?? ""
        ),
        caption: String(
          node.edge_media_to_caption?.edges?.[0]?.node?.text ??
          node.caption?.text ??
          ""
        ),
      };
    })
    .filter((p) => p.id && p.thumbnailUrl);
}

async function fetchFromApiEndpoint(username: string): Promise<ScrapedPost[]> {
  const res = await fetch(
    `https://www.instagram.com/${encodeURIComponent(username)}/?__a=1&__d=dis`,
    { headers: IG_HEADERS, signal: AbortSignal.timeout(12_000) }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();

  const edges =
    data?.graphql?.user?.edge_owner_to_timeline_media?.edges ??
    data?.data?.user?.edge_owner_to_timeline_media?.edges ??
    [];

  if (!edges.length) throw new Error("No posts found in API response");
  return extractEdges(edges);
}

async function fetchFromHtml(username: string): Promise<ScrapedPost[]> {
  const res = await fetch(
    `https://www.instagram.com/${encodeURIComponent(username)}/`,
    {
      headers: { ...IG_HEADERS, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(18_000),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // Pattern 1: window._sharedData
  const sharedMatch = html.match(/window\._sharedData\s*=\s*(\{[\s\S]+?\});\s*<\/script>/);
  if (sharedMatch) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = JSON.parse(sharedMatch[1]);
      const edges =
        data?.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_owner_to_timeline_media?.edges ?? [];
      if (edges.length) return extractEdges(edges);
    } catch { /* fall through */ }
  }

  // Pattern 2: window.__additionalDataLoaded
  const additionalMatch = html.match(
    /window\.__additionalDataLoaded\s*\(\s*['"][^'"]+['"]\s*,\s*(\{[\s\S]+?\})\s*\)\s*;/
  );
  if (additionalMatch) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = JSON.parse(additionalMatch[1]);
      const edges = data?.graphql?.user?.edge_owner_to_timeline_media?.edges ?? [];
      if (edges.length) return extractEdges(edges);
    } catch { /* fall through */ }
  }

  // Pattern 3: script tags with JSON containing edge_owner_to_timeline_media
  const scriptMatches = [...html.matchAll(/<script[^>]*>(\{[^<]{200,})<\/script>/g)];
  for (const m of scriptMatches) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = JSON.parse(m[1]);
      const edges =
        data?.graphql?.user?.edge_owner_to_timeline_media?.edges ??
        data?.data?.user?.edge_owner_to_timeline_media?.edges ??
        [];
      if (edges.length) return extractEdges(edges);
    } catch { /* fall through */ }
  }

  throw new Error("Could not extract posts from page HTML — Instagram may require login");
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim() ?? "";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
    return NextResponse.json({ error: "Invalid Instagram username" }, { status: 400 });
  }

  let posts: ScrapedPost[] = [];

  try {
    posts = await fetchFromApiEndpoint(username);
  } catch {
    try {
      posts = await fetchFromHtml(username);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown error";
      return NextResponse.json(
        { error: `Could not fetch Instagram posts: ${msg}` },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ posts }, { headers: { "Cache-Control": "no-store" } });
}
