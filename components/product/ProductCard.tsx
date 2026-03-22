"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SanityProduct } from "@/lib/sanity";
import { buildWhatsAppOrderUrl, buildWhatsAppNotifyUrl } from "@/lib/whatsapp";
function WaIcon({ size = 18 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>);
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
        {canTryOn && (<button type="button" onClick={() => onTryOn!(product)} className="mt-1 w-full h-9 rounded-pill border border-border font-sans font-medium text-[13px] text-text-secondary hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-1.5" aria-label={`Try on ${product.name} virtually`}><span aria-hidden="true" className="text-[15px]">✦</span>Try On</button>)}
      </div>
    </article>
  );
}
export function ProductCardSkeleton() {
  return (<div className="flex flex-col bg-surface rounded-card overflow-hidden border border-border" aria-hidden="true"><div className="aspect-product w-full skeleton" /><div className="flex flex-col gap-2 px-3 pt-3 pb-3.5"><div className="h-4 w-3/4 rounded skeleton" /><div className="flex justify-between items-center"><div className="h-5 w-14 rounded-full skeleton" /><div className="h-4 w-20 rounded skeleton" /></div></div></div>);
}
