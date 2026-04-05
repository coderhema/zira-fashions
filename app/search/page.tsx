import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/sanity";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGridClient } from "@/components/product/ProductGridClient";
import { ProductCardSkeleton } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Browse all Zira Fashions products — denim, dresses, tops, sets, kids and more.",
};

export default async function SearchPage() {
  const products = await getAllProducts();

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <div className="max-w-screen-xl mx-auto px-5 py-8 md:py-12">
          <div className="mb-8">
            <p className="section-label mb-1.5">Zira Fashions</p>
            <h1 className="font-display font-medium text-h1 text-text-primary">All Products</h1>
            <p className="font-sans text-small text-text-muted mt-1">
              {products.length} item{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ProductGridClient products={products} showTryOn />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
