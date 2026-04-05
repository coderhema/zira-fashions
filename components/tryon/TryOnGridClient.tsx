"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import type { SanityProduct } from "@/lib/sanity";
import { TryOnModal } from "./TryOnModal";

interface Props { products: SanityProduct[]; }

export function TryOnGridClient({ products }: Props) {
  const [sel,  setSel]  = useState<SanityProduct | null>(null);
  const open  = useCallback((p: SanityProduct) => setSel(p), []);
  const close = useCallback(() => setSel(null), []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5" role="list">
        {products.map((p) => (
          <button key={p._id} type="button" onClick={() => open(p)}
            className="group relative flex flex-col bg-surface rounded-card overflow-hidden border border-border text-left transition-all duration-[180ms] hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(44,58,92,0.18)]"
            aria-label={`Try on ${p.name}`} role="listitem">
            <div className="relative aspect-product w-full bg-surface-muted overflow-hidden">
              {p.imageUrl ? (
                <Image src={p.imageUrl} alt={p.name} fill sizes="(max-width:640px) 50vw,33vw"
                  className="object-cover object-center transition-transform duration-[280ms] group-hover:scale-[1.02]" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl" aria-hidden="true">👗</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-[200ms]"
                style={{ background: "linear-gradient(to top,rgba(44,58,92,0.5) 0%,transparent 60%)" }}>
                <span className="font-sans font-semibold text-[14px] text-white flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-[16px]">✦</span>Try On
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-3">
              <p className="font-sans font-medium text-[14px] text-text-primary line-clamp-1">{p.name}</p>
              <span className="price-tag text-[14px] flex-shrink-0">{p.price}</span>
            </div>
          </button>
        ))}
      </div>
      {sel && <TryOnModal product={sel} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} onClose={close} />}
    </>
  );
}
