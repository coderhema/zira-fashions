import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity";

export const runtime = "nodejs";

function toSlug(caption: string, id: string): string {
  const base = caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const suffix = id.slice(-8);
  return base ? `${base}-${suffix}` : `instagram-${suffix}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, thumbnailUrl, caption } = body as {
    id?: string;
    thumbnailUrl?: string;
    caption?: string;
  };

  if (!id || !thumbnailUrl) {
    return NextResponse.json({ error: "id and thumbnailUrl are required" }, { status: 400 });
  }

  // Download image as buffer
  let buffer: Buffer;
  try {
    const imgRes = await fetch(thumbnailUrl, { signal: AbortSignal.timeout(20_000) });
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    buffer = Buffer.from(await imgRes.arrayBuffer());
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to download image: ${e instanceof Error ? e.message : "unknown"}` },
      { status: 502 }
    );
  }

  // Upload image asset to Sanity
  try {
    const asset = await serverClient.assets.upload("image", buffer, {
      filename: `instagram-${id}.jpg`,
      contentType: "image/jpeg",
    });

    const captionText = (caption ?? "").trim();
    const name = captionText.slice(0, 80) || `Instagram Post ${id}`;
    const slug = toSlug(captionText, id);

    // Create a draft product document using the existing product schema.
    // Required fields are pre-filled with placeholder values so the document
    // can be reviewed and completed in Sanity Studio.
    const doc = {
      _id: `drafts.instagram-${id}`,
      _type: "product",
      name,
      slug: { _type: "slug", current: slug },
      price: "TBD",
      size: "TBD",
      category: "dresses",
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
      description: captionText || undefined,
      isNew: true,
      isSoldOut: false,
      isKids: false,
    };

    await serverClient.createOrReplace(doc);

    return NextResponse.json({ success: true, docId: doc._id });
  } catch (e) {
    return NextResponse.json(
      { error: `Sanity upload failed: ${e instanceof Error ? e.message : "unknown"}` },
      { status: 500 }
    );
  }
}
