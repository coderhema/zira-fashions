import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getKidsProducts } from "@/lib/sanity";
import { ProductGridClient } from "@/components/product/ProductGridClient";
import { ProductCardSkeleton } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Kids Collection",
  description: "Trendy UK & US brands for little ones, age 0\u201316. Shop Zira Kids for brand new & pre-owned fashion. Nationwide delivery.",
};

export default async function KidsPage() {
  const products = await getKidsProducts();

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section
          className="w-full py-14 md:py-20"
          style={{ backgroundColor: "var(--color-kids-accent)" }}
          aria-label="Zira Kids hero"
        >
          <div className="max-w-screen-xl mx-auto px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-sans font-semibold text-[11px] tracking-[0.08em] uppercase text-white/80 mb-2">
                Sub-brand
              </p>
              <h1 className="font-display font-medium text-h1 text-white leading-tight">
                Zira Kids
              </h1>
              <p className="font-sans text-[15px] text-white/85 leading-editorial mt-3 max-w-xs">
                Trendy UK &amp; US brands for little ones, age 0&ndash;16.
              </p>
            </div>
            <Link
              href="/shop"
              className="flex-shrink-0 self-start md:self-auto font-sans font-semibold text-[14px] text-white/80 hover:text-white underline underline-offset-4 transition-colors"
            >
              &larr; Back to all products
            </Link>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-5 py-8 md:py-12">
          <div className="mb-8">
            <p className="section-label mb-1.5">Zira Fashions Kids</p>
            <h2 className="font-display font-medium text-h1 text-text-primary">Kids Collection</h2>
            <p className="font-sans text-small text-text-muted mt-1">
              {products.length} item{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ProductGridClient products={products} showTryOn={false} />
          </Suspense>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="text-5xl" aria-hidden="true">👗</span>
              <p className="font-sans font-medium text-[16px] text-text-secondary">
                New kids items coming soon.
              </p>
              <Link href="/shop" className="btn-primary mt-2">
                Browse the Shop
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
