import type { Metadata }         from "next";
import { Suspense }              from "react";
import { getAllProducts, getProductsByCategory, getSaleProducts, type ProductCategory } from "@/lib/sanity";
import { ProductGridClient }     from "@/components/product/ProductGridClient";
import { ProductCardSkeleton }   from "@/components/product/ProductCard";
import { Header }                from "@/components/layout/Header";
import { Footer }                from "@/components/layout/Footer";
import { ShopFilters }           from "@/components/product/ShopFilters";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse all Zira Fashions items \u2014 denim, dresses, tops, sets and more. Brand new & pre-owned UK and US highstreet brands. Nationwide delivery.",
};

const VALID: ProductCategory[] = ["denim", "dresses", "tops", "sets", "sale", "kids"];

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const rawCat  = searchParams.category;
  const category = VALID.includes(rawCat as ProductCategory) ? rawCat as ProductCategory : null;
  const products = category === "sale" ? await getSaleProducts() : category ? await getProductsByCategory(category) : await getAllProducts();
  const heading  = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products";

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <div className="max-w-screen-xl mx-auto px-5 py-8 md:py-12">
          <div className="mb-8">
            <p className="section-label mb-1.5">Zira Fashions</p>
            <h1 className="font-display font-medium text-h1 text-text-primary">{heading}</h1>
            <p className="font-sans text-small text-text-muted mt-1">{products.length} item{products.length !== 1 ? "s" : ""}</p>
          </div>
          <Suspense><ShopFilters activeCategory={category} /></Suspense>
          <div className="mt-6">
            <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">{Array.from({length:6}).map((_,i)=><ProductCardSkeleton key={i}/>)}</div>}>
              <ProductGridClient products={products} showTryOn />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
