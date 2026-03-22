"use client";

import { useState, useCallback } from "react";
import type { SanityProduct }    from "@/lib/sanity";
import { ProductCard }           from "./ProductCard";
import { TryOnModal }            from "@/components/tryon/TryOnModal";

interface Props { products: SanityProduct[]; showTryOn?: boolean; priorityCount?: number; }

export function ProductGridClient({ products, showTryOn = true, priorityCount = 3 }: Props) {
  const [tryOn, setTryOn] = useState<SanityProduct | null>(null);
  const open  = useCallback((p: SanityProduct) => setTryOn(p), []);
  const close = useCallback(() => setTryOn(null), []);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl" aria-hidden="true">👗</span>
        <p className="font-sans font-medium text-[16px] text-text-secondary">No products here yet.</p>
        <p className="font-sans text-small text-text-muted">New items drop regularly.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5" role="list" aria-label="Products">
        {products.map((p, i) => (
          <div key={p._id} role="listitem">
            <ProductCard product={p} showTryOn={showTryOn} onTryOn={open} priority={i < priorityCount} />
          </div>
        ))}
      </div>
      {tryOn && <TryOnModal product={tryOn} siteUrl={process.env.NEXT_PUBLIC_SITE_URL} onClose={close} />}
    </>
  );
}
