# Instagram → Sanity Upload Script

`scripts/upload-instagram-to-sanity.js` fetches your Instagram posts via the
[Instagram Graph API](https://developers.facebook.com/docs/instagram-api), downloads each
image, uploads it to your Sanity project as a media asset, and creates a
`instagramPost` document for every post containing the caption and a reference to
the uploaded image.

---

## Prerequisites

- Node.js 18 or later (ESM + top-level `await`)
- A Facebook Developer app with the **Instagram Graph API** product enabled
- An Instagram **Business** or **Creator** account connected to a Facebook Page
- Your Sanity project with a write-enabled API token

---

## 1 · Get your Instagram Access Token

### Step 1 — Create a Facebook App

1. Go to [developers.facebook.com](https://developers.facebook.com/) and sign in.
2. Click **My Apps → Create App**.
3. Choose **Business** (or **Other**) and hit **Next**.
4. Fill in the app name and contact email, then click **Create App**.

### Step 2 — Add the Instagram Graph API product

1. In your app dashboard, click **Add Product**.
2. Find **Instagram Graph API** and click **Set Up**.

### Step 3 — Connect your Instagram Business account

1. Under **Instagram Graph API → Settings**, link your Facebook Page.
2. Make sure your Instagram account is a **Business** or **Creator** account and is
   connected to that Page (Instagram → Settings → Account → Switch to Professional).

### Step 4 — Generate a long-lived access token

Short-lived tokens expire in 1 hour. You need a long-lived token (valid 60 days).

```bash
# 1. Get a short-lived token via the Graph API Explorer
#    https://developers.facebook.com/tools/explorer/
#    Select your app, request these permissions:
#      instagram_basic, pages_show_list, instagram_content_publish (optional)

# 2. Exchange it for a long-lived token
curl -G "https://graph.facebook.com/v19.0/oauth/access_token" \
  --data-urlencode "grant_type=ig_exchange_token" \
  --data-urlencode "client_id=YOUR_APP_ID" \
  --data-urlencode "client_secret=YOUR_APP_SECRET" \
  --data-urlencode "access_token=SHORT_LIVED_TOKEN"
```

Copy the returned `access_token` value — this is your `INSTAGRAM_ACCESS_TOKEN`.

> **Tip:** Long-lived tokens can be refreshed before expiry:
> ```bash
> curl -G "https://graph.facebook.com/v19.0/refresh_access_token" \
>   --data-urlencode "grant_type=ig_refresh_token" \
>   --data-urlencode "access_token=LONG_LIVED_TOKEN"
> ```

---

## 2 · Get a Sanity write token

1. Open [sanity.io/manage](https://www.sanity.io/manage) and select your project.
2. Go to **API → Tokens → Add API Token**.
3. Name it `instagram-upload`, set permissions to **Editor** (or **Deploy Studio**).
4. Copy the token — this is your `SANITY_WRITE_TOKEN`.

---

## 3 · Configure environment variables

Copy `.env.example` to `.env` (if you haven't already) and fill in:

```dotenv
INSTAGRAM_ACCESS_TOKEN=IGQ...         # long-lived token from Step 1
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123  # your Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production # usually "production"
SANITY_WRITE_TOKEN=sk...              # write token from Step 2
```

---

## 4 · Add the `instagramPost` schema to Sanity (first time only)

The script creates documents of type `instagramPost`. Add this schema file to your
Sanity studio's `schemas/` folder if it doesn't exist yet:

```js
// sanity/schemas/instagramPost.js
export default {
  name: "instagramPost",
  title: "Instagram Post",
  type: "document",
  fields: [
    { name: "instagramId", title: "Instagram ID", type: "string" },
    { name: "caption",     title: "Caption",      type: "text"   },
    { name: "permalink",   title: "Permalink",    type: "url"    },
    { name: "publishedAt", title: "Published At", type: "datetime" },
    { name: "image",       title: "Image",        type: "image"  },
  ],
};
```

Register it in your studio's `sanity.config.ts` / `schema.ts`.

---

## 5 · Install dependencies

The script uses `node-fetch` and `@sanity/client`. Both are already in this project.
If you're running the script in a separate folder, install them:

```bash
npm install node-fetch @sanity/client
```

---

## 6 · Run the script

```bash
node scripts/upload-instagram-to-sanity.js
```

Progress is logged for every post:

```
📥  Fetching Instagram posts…
✅  Found 24 posts.

⬇️   [17841234567890] Downloading image…
⬆️   [17841234567890] Uploading to Sanity…
📄  [17841234567890] Creating Sanity document…
✅  [17841234567890] Done → Sanity doc: instagramPost-17841234567890

…
────────────────────────────────────────────────
Done. 24 uploaded, 0 failed.
```

Re-running the script is safe — it uses `createOrReplace`, so existing documents are
updated rather than duplicated.

---

## Notes

- **VIDEO posts**: The script uses `thumbnail_url` as a fallback when `media_url` is
  absent (common for videos). Only the thumbnail image is uploaded, not the video file.
- **CAROUSEL posts**: Only the cover image (`media_url`) of the album is uploaded.
  To upload child images, extend the script to call the `/media` edge on each carousel.
- **Rate limits**: The Instagram Graph API limits requests. If you have hundreds of
  posts, add a small delay between uploads to stay within limits.
