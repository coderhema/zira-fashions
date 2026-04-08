import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { serverClient } from "@/lib/sanity";

export const runtime = "nodejs";

const C = {
  bg: "#F7F4EE", sf: "#FFFFFF", sm: "#F0EDE6", pr: "#2C3A5C",
  ac: "#C9A090", price: "#C9A090", sale: "#B05A4A", wa: "#25D366",
  text: "#1A1A1A", ts: "#5C5C5C", tm: "#9A9490", kids: "#E8A0B0", border: "#E8E4DC",
};

const BADGES = {
  new:        { label: "New In",   bg: C.pr,   text: "#FFF" },
  sale:       { label: "Sale",     bg: C.sale,  text: "#FFF" },
  "sold-out": { label: "Sold Out", bg: C.sm,    text: C.tm   },
} as const;

function p(sp: URLSearchParams, k: string, d = "") { return sp.get(k) ?? d; }
function t(s: string, n: number) { return s.length <= n ? s : s.slice(0, n - 1) + "…"; }

export async function GET(req: NextRequest): Promise<ImageResponse> {
  const params    = new URL(req.url).searchParams;
  const productId = params.get("productId");

  let name: string, price: string, size: string, imgUrl: string, badge: string, isKids: boolean;

  if (productId) {
    // Fetch product from Sanity by _id
    const product = await serverClient.fetch<{
      title?: string; name?: string; price?: string; size?: string;
      imageUrl?: string; isSoldOut?: boolean; isNew?: boolean;
      originalPrice?: string; isKids?: boolean;
    } | null>(
      `*[_id == $id][0]{ name, price, size, "imageUrl": image.asset->url, isSoldOut, isNew, originalPrice, isKids }`,
      { id: productId }
    );
    name    = t(product?.name ?? "Zira Fashions", 48);
    price   = product?.price ?? "";
    size    = product?.size ?? "";
    imgUrl  = product?.imageUrl ?? "";
    isKids  = product?.isKids ?? false;
    badge   = product?.isSoldOut ? "sold-out" : product?.originalPrice ? "sale" : product?.isNew ? "new" : "";
  } else {
    name    = t(p(params, "name", "Zira Fashions"), 48);
    price   = p(params, "price");
    size    = p(params, "size");
    imgUrl  = p(params, "image");
    badge   = p(params, "badge");
    isKids  = p(params, "kids") === "true";
  }

  const accent = isKids ? C.kids : C.ac;
  const bc     = badge && badge in BADGES ? BADGES[badge as keyof typeof BADGES] : null;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, backgroundColor: C.bg, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "40px 72px", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 340, height: 340, borderRadius: "50%", backgroundColor: C.pr, opacity: 0.06 }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 240, height: 240, borderRadius: "50%", backgroundColor: accent, opacity: 0.12 }} />
        <div style={{ width: 520, height: 548, backgroundColor: C.sf, borderRadius: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${C.border}`, position: "relative" }}>
          {imgUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? (<img src={imgUrl} alt={name} width={520} height={548} style={{ objectFit: "cover", width: "100%", height: "100%" }} />)
            : (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.tm }}><div style={{ fontSize: 48 }}>👗</div><div style={{ fontSize: 14, fontWeight: 500, marginTop: 8 }}>Zira Fashions</div></div>)
          }
          {bc && <div style={{ position: "absolute", top: 16, left: 16, backgroundColor: bc.bg, color: bc.text, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 100 }}>{bc.label}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 540, paddingLeft: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Zira Fashions</div>
          <div style={{ fontSize: name.length > 24 ? 36 : 44, fontWeight: 600, color: C.text, lineHeight: 1.2, marginBottom: 20 }}>{name}</div>
          {size && <div style={{ fontSize: 13, fontWeight: 500, color: C.ts, backgroundColor: C.sm, padding: "5px 14px", borderRadius: 100, marginBottom: 16, width: "fit-content" }}>{size}</div>}
          {price && <div style={{ fontSize: 40, fontWeight: 700, color: badge === "sale" ? C.sale : C.price, marginBottom: 36, lineHeight: 1 }}>{price}</div>}
          <div style={{ width: 48, height: 2, backgroundColor: accent, marginBottom: 32, borderRadius: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: C.wa, color: "#FFF", fontSize: 17, fontWeight: 600, padding: "16px 28px", borderRadius: 100, width: "fit-content" }}>
            Order on WhatsApp
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: C.tm }}>Nationwide delivery available</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
