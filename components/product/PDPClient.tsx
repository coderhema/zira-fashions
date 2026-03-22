"use client";
import Image from "next/image";
import { useState } from "react";
import type { SanityProduct } from "@/lib/sanity";
import { TryOnModal } from "@/components/tryon/TryOnModal";
import { buildWhatsAppOrderUrl, buildWhatsAppNotifyUrl } from "@/lib/whatsapp";

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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
                  <span aria-hidden="true" className="text-[17px]">✦</span>Try On with AI
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
