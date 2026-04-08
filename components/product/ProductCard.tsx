"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SanityProduct } from "@/lib/sanity";
import { buildWhatsAppOrderUrl, buildWhatsAppNotifyUrl } from "@/lib/whatsapp";
import { Whatsapp, Sparks } from "iconoir-react";
function WaIcon({ size = 18 }: { size?: number }) {
  return <Whatsapp width={size} height={size} aria-hidden="true" />;
}
interface ProductCardProps { product: SanityProduct; showTryOn?: boolean; onTryOn?: (product: SanityProduct) => void; priority?: boolean; }
export function ProductCard({ product, showTryOn = true, onTryOn, priority = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zirafashions.com";
  const pdpUrl = `${siteUrl}/product/${product.slug}`;
  const orderUrl = buildWhatsAppOrderUrl({ name: product.name, size: product.size, price: product.price, productUrl: pdpUrl, sku: product.sku });
  const notifyUrl = buildWhatsAppNotifyUrl({ name: product.name, size: product.size, productUrl: pdpUrl, sku: product.sku });
  const canTryOn = showTryOn && !product.isKids && !!product.tryOnGarmentUrl && typeof onTryOn === "function";
  const isOnSale = !!product.originalPrice;
  return (
    <article className="group relative flex flex-col bg-surface rounded-card overflow-hidden border border-border transition-all duration-[180ms] hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(44,58,92,0.18)]" aria-label={`${product.name}, Size ${product.size}, ${product.price}`}>
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-surface-muted" tabIndex={-1} aria-hidden="true">
        <div className="aspect-product w-full relative">
          {!imgError && product.imageUrl ? (<Image src={product.imageUrl} alt={product.name} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" className={`object-cover object-center transition-transform duration-[280ms] group-hover:scale-[1.02] ${product.isSoldOut ? "grayscale opacity-50" : ""}`} priority={priority} onError={() => setImgError(true)} />) : (<div className="absolute inset-0 flex items-center justify-center bg-surface-muted"><span className="text-4xl" aria-hidden="true">👗</span></div>)}
          {product.isSoldOut ? (<div className="absolute inset-0 flex items-center justify-center"><span className="px-4 py-1.5 rounded-pill bg-surface text-text-muted font-sans font-medium text-small tracking-wider uppercase shadow-sm">Sold Out</span></div>) : product.isNew ? (<div className="absolute top-3 left-3"><span className="px-3 py-1 rounded-pill bg-primary text-white font-sans font-semibold text-[11px] tracking-[0.06em] uppercase">New In</span></div>) : isOnSale ? (<div className="absolute top-3 left-3"><span className="px-3 py-1 rounded-pill bg-sale text-white font-sans font-semibold text-[11px] tracking-[0.06em] uppercase">Sale</span></div>) : null}
          {!product.isSoldOut && (<div className="absolute bottom-0 inset-x-0 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-[200ms]"><a href={orderUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Order ${product.name} on WhatsApp`} className="btn-whatsapp w-full rounded-none justify-center gap-2 text-[14px] h-[46px]"><WaIcon size={16} />Order on WhatsApp</a></div>)}
          {product.isSoldOut && (<div className="absolute bottom-0 inset-x-0"><a href={notifyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center justify-center w-full h-[46px] rounded-none bg-surface-muted text-text-secondary font-sans font-medium text-[13px] hover:bg-border transition-colors">Notify Me</a></div>)}
        </div>
      </Link>
      <div className="flex flex-col gap-2 px-3 pt-3 pb-3.5">
        <Link href={`/product/${product.slug}`} className="font-sans font-medium text-h3 text-text-primary leading-tight hover:text-primary transition-colors line-clamp-1">{product.name}</Link>
        <div className="flex items-center justify-between gap-2">
          <span className="size-chip">{product.size}</span>
          <div className="flex items-center gap-2 flex-wrap justify-end">{isOnSale && <span className="price-tag-original">{product.originalPrice}</span>}<span className={isOnSale ? "price-tag-sale" : "price-tag"}>{product.price}</span></div>
        </div>
        {canTryOn && (<button type="button" onClick={() => onTryOn!(product)} className="mt-1 w-full h-9 rounded-pill border border-border font-sans font-medium text-[13px] text-text-secondary hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-1.5" aria-label={`Try on ${product.name} virtually`}><Sparks width={15} height={15} aria-hidden="true" />Try On</button>)}
      </div>
    </article>
  );
}
export function ProductCardSkeleton() {
  return (<div className="flex flex-col bg-surface rounded-card overflow-hidden border border-border" aria-hidden="true"><div className="aspect-product w-full skeleton" /><div className="flex flex-col gap-2 px-3 pt-3 pb-3.5"><div className="h-4 w-3/4 rounded skeleton" /><div className="flex justify-between items-center"><div className="h-5 w-14 rounded-full skeleton" /><div className="h-4 w-20 rounded skeleton" /></div></div></div>);
}
