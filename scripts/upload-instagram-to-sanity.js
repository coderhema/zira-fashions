#!/usr/bin/env node
/**
 * upload-instagram-to-sanity.js
 *
 * Fetches posts from your Instagram Business account via the Instagram Graph API,
 * downloads each image, uploads it to Sanity as an asset, and creates (or patches)
 * a Sanity document for every post with its caption and image reference.
 *
 * Usage: node scripts/upload-instagram-to-sanity.js
 *
 * Requires a .env file in the project root with the variables listed in .env.example.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Load .env values from the project root (one directory up from /scripts)
// ---------------------------------------------------------------------------
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

if (!existsSync(envPath)) {
  console.error("❌  .env file not found. Copy .env.example to .env and fill in your values.");
  process.exit(1);
}

// Minimal dotenv parser (avoids adding another dependency)
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  if (!(key in process.env)) process.env[key] = val;
}

// ---------------------------------------------------------------------------
// Validate required env vars
// ---------------------------------------------------------------------------
const REQUIRED = [
  "INSTAGRAM_ACCESS_TOKEN",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_WRITE_TOKEN",
];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("❌  Missing required env vars:", missing.join(", "));
  process.exit(1);
}

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const SANITY_PROJECT_ID      = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET         = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_WRITE_TOKEN     = process.env.SANITY_WRITE_TOKEN;

// ---------------------------------------------------------------------------
// Imports (node-fetch + @sanity/client)
// ---------------------------------------------------------------------------
const fetch         = (await import("node-fetch")).default;
const { createClient } = await import("@sanity/client");

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset:   SANITY_DATASET,
  apiVersion: "2024-01-01",
  token:     SANITY_WRITE_TOKEN,
  useCdn:    false,
});

// ---------------------------------------------------------------------------
// Instagram Graph API helpers
// ---------------------------------------------------------------------------
const IG_API = "https://graph.instagram.com";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,timestamp,permalink";

async function fetchInstagramPosts() {
  const url = `${IG_API}/me/media?fields=${FIELDS}&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=50`;
  console.log("📥  Fetching Instagram posts…");
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Instagram API error ${res.status}: ${body}`);
  }
  const json = await res.json();
  return json.data ?? [];
}

// ---------------------------------------------------------------------------
// Download image as a Buffer
// ---------------------------------------------------------------------------
async function downloadImage(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to download image from ${imageUrl}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Upload a Buffer to Sanity and return the asset reference
// ---------------------------------------------------------------------------
async function uploadToSanity(buffer, filename) {
  const asset = await sanity.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });
  return {
    _type: "reference",
    _ref:  asset._id,
  };
}

// ---------------------------------------------------------------------------
// Create or update a Sanity document for an Instagram post
// ---------------------------------------------------------------------------
async function upsertSanityDocument(post, imageRef) {
  const docId = `instagramPost-${post.id}`;
  const doc = {
    _id:   docId,
    _type: "instagramPost",
    instagramId: post.id,
    caption:     post.caption ?? "",
    permalink:   post.permalink,
    publishedAt: post.timestamp,
    image: {
      _type: "image",
      asset: imageRef,
    },
  };

  await sanity.createOrReplace(doc);
  return docId;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const posts = await fetchInstagramPosts();
  console.log(`✅  Found ${posts.length} posts.\n`);

  let succeeded = 0;
  let failed    = 0;

  for (const post of posts) {
    const imageUrl = post.media_url ?? post.thumbnail_url;

    if (!imageUrl) {
      console.warn(`⚠️   Post ${post.id}: no image URL (media_type=${post.media_type}). Skipping.`);
      failed++;
      continue;
    }

    try {
      console.log(`⬇️   [${post.id}] Downloading image…`);
      const buffer = await downloadImage(imageUrl);

      const filename = `instagram-${post.id}.jpg`;
      console.log(`⬆️   [${post.id}] Uploading to Sanity…`);
      const imageRef = await uploadToSanity(buffer, filename);

      console.log(`📄  [${post.id}] Creating Sanity document…`);
      const docId = await upsertSanityDocument(post, imageRef);

      console.log(`✅  [${post.id}] Done → Sanity doc: ${docId}\n`);
      succeeded++;
    } catch (err) {
      console.error(`❌  [${post.id}] Failed: ${err.message}\n`);
      failed++;
    }
  }

  console.log("─".repeat(48));
  console.log(`Done. ${succeeded} uploaded, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
