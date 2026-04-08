"use client";
import Image from "next/image";
import { useState } from "react";
import type { SanityProduct } from "@/lib/sanity";
import { TryOnModal } from "@/components/tryon/TryOnModal";
import { buildWhatsAppOrderUrl, buildWhatsAppNotifyUrl } from "@/lib/whatsapp";
import { Sparks, Whatsapp } from "iconoir-react";

function WaIcon() {
  return <Whatsapp width={20} height={20} aria-hidden="true" />;
}

interface Props { product: SanityProduct; siteUrl: string; }

export function PDPClient({ product, siteUrl }: Props) {
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const pdpUrl    = `${siteUrl}/product/${product.slug}`;
  const orderUrl  = buildWhatsAppOrderUrl({ name: product.name, size: product.size, price: product.price, productUrl: pdpUrl, sku: product.sku });
  const notifyUrl = buildWhatsAppNotifyUrl({ name: product.name, size: product.size, productUrl: pdpUrl, sku: product.sku });
  const isOnSale  = !!product.originalPrice;
  const canTryOn  = !product.isKids && !!product.tryOnGarmentUrl;

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-5 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-start">
          <div className="w-full md:w-[58%] flex-shrink-0">
            <div className="relative aspect-product w-full rounded-card overflow-hidden bg-surface-muted">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill priority
                  sizes="(max-width:768px) 100vw, 58vw"
                  className={`object-cover object-center ${product.isSoldOut ? "grayscale opacity-60" : ""}`} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl" aria-hidden="true">👗</span>
                </div>
              )}
              {product.isSoldOut && (
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 rounded-pill bg-surface text-text-muted font-sans font-medium text-small tracking-wider uppercase shadow-sm">Sold Out</span>
                </div>
              )}
              {!product.isSoldOut && product.isNew && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-pill bg-primary text-white font-sans font-semibold text-[11px] tracking-[0.06em] uppercase">New In</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-[42%] md:sticky md:top-24 flex flex-col gap-6">
            <p className="section-label capitalize">{product.category}</p>
            <h1 className="font-display font-medium text-h1 text-text-primary leading-tight">{product.name}</h1>

            <div className="flex items-center justify-between gap-4 py-4 border-y border-border">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-small text-text-muted">Size</span>
                <span className="size-chip text-[14px] px-3 py-1">{product.size}</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="font-sans text-small text-text-muted">Price</span>
                <div className="flex items-center gap-2">
                  {isOnSale && <span className="price-tag-original text-[15px]">{product.originalPrice}</span>}
                  <span className={`${isOnSale ? "price-tag-sale" : "price-tag"} text-[24px]`}>{product.price}</span>
                </div>
              </div>
            </div>

            {product.description && <p className="font-sans text-body text-text-secondary leading-editorial">{product.description}</p>}
            {product.sku && <p className="font-sans text-small text-text-muted">Ref: {product.sku}</p>}

            <div className="flex flex-col gap-3">
              {!product.isSoldOut ? (
                <a href={orderUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center text-[16px] h-[56px]"
                  aria-label={`Order ${product.name} on WhatsApp`}>
                  <WaIcon />Order on WhatsApp
                </a>
              ) : (
                <a href={notifyUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full h-[56px] rounded-pill flex items-center justify-center gap-2 font-sans font-semibold text-[16px] bg-surface-muted text-text-secondary hover:bg-border transition-colors">
                  Notify Me When Back In Stock
                </a>
              )}
              {canTryOn && !product.isSoldOut && (
                <button type="button" onClick={() => setTryOnOpen(true)}
                  className="w-full h-[52px] rounded-pill border border-border font-sans font-semibold text-[15px] text-text-secondary hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
                  aria-label={`Try on ${product.name} virtually`}>
                  <Sparks width={17} height={17} aria-hidden="true" />Try On with AI
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {[["Nationwide delivery"], ["Order via WhatsApp"], ["See our policy"]].map(([label]) => (
                <div key={label} className="flex items-center gap-1.5 font-sans text-small text-text-muted">{label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {tryOnOpen && <TryOnModal product={product} siteUrl={siteUrl} onClose={() => setTryOnOpen(false)} />}
    </>
  );
}
