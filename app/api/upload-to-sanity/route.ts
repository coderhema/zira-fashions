import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity";

export const runtime = "nodejs";

interface PostInput {
  id: string;
  thumbnailUrl: string;
  caption?: string;
  name?: string;
  price?: string;
  category?: string;
}

// Allowlist of hostname suffixes accepted for thumbnailUrl.
// These cover Instagram's CDN (cdninstagram.com) and Facebook's CDN (fbcdn.net)
// which Instagram also uses for media delivery.
const ALLOWED_CDN_SUFFIXES = [".cdninstagram.com", ".fbcdn.net"];

function isAllowedThumbnailUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_CDN_SUFFIXES.some(
      (suffix) => parsed.hostname === suffix.slice(1) || parsed.hostname.endsWith(suffix)
    );
  } catch {
    return false;
  }
}

// Progress event written to the NDJSON stream for each post.
interface ProgressEvent {
  id: string;
  status: "uploading" | "success" | "error";
  docId?: string;
  error?: string;
}

function toSlug(caption: string, id: string): string {
  const base = caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const suffix = id.slice(-8);
  return base ? `${base}-${suffix}` : `instagram-${suffix}`;
}

async function uploadPost(post: PostInput): Promise<ProgressEvent> {
  const { id, thumbnailUrl, caption = "", name: postName, price: postPrice, category: postCategory } = post;

  // Download image as buffer
  const imgRes = await fetch(thumbnailUrl, { signal: AbortSignal.timeout(20_000) });
  if (!imgRes.ok) throw new Error(`Image download failed for post ${id}: HTTP ${imgRes.status}`);
  const buffer = Buffer.from(await imgRes.arrayBuffer());

  // Upload image asset to Sanity
  const asset = await serverClient.assets.upload("image", buffer, {
    filename: `instagram-${id}.jpg`,
    contentType: "image/jpeg",
  });

  const captionText = caption.trim();
  const name = (postName?.trim() || captionText.slice(0, 80) || `Instagram Post ${id}`).slice(0, 80);
  const slug = toSlug(captionText || name, id);
  const price = postPrice?.trim() || "TBD";
  const category = postCategory?.trim() || "uncategorized";

  // Create a draft product document using the existing product schema.
  // Required fields are pre-filled with placeholder values so the document
  // can be reviewed and completed in Sanity Studio.
  const doc = {
    _id: `drafts.instagram-${id}`,
    _type: "product",
    name,
    slug: { _type: "slug", current: slug },
    price,
    size: "TBD",
    category,
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

  return { id, status: "success", docId: doc._id };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { posts } = body as { posts?: unknown };

  if (!Array.isArray(posts) || posts.length === 0) {
    return NextResponse.json({ error: "posts array is required" }, { status: 400 });
  }

  for (const p of posts) {
    if (
      typeof p !== "object" ||
      p === null ||
      typeof (p as Record<string, unknown>).id !== "string" ||
      typeof (p as Record<string, unknown>).thumbnailUrl !== "string"
    ) {
      return NextResponse.json(
        { error: "Each post must have a string id and thumbnailUrl" },
        { status: 400 }
      );
    }
    if (!isAllowedThumbnailUrl((p as Record<string, unknown>).thumbnailUrl as string)) {
      return NextResponse.json(
        { error: "thumbnailUrl must be an HTTPS URL from an Instagram CDN domain" },
        { status: 400 }
      );
    }
  }

  const validPosts = posts as PostInput[];
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: ProgressEvent) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };

      for (const post of validPosts) {
        emit({ id: post.id, status: "uploading" });
        try {
          const result = await uploadPost(post);
          emit(result);
        } catch (e) {
          emit({
            id: post.id,
            status: "error",
            error: e instanceof Error ? e.message : "Upload failed",
          });
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
