import { notFound }             from "next/navigation";
import type { Metadata }        from "next";
import { Suspense }             from "react";
import { getProductsByCategory, getSaleProducts, getKidsProducts, type ProductCategory } from "@/lib/sanity";
import { ProductGridClient }    from "@/components/product/ProductGridClient";
import { ProductCardSkeleton }  from "@/components/product/ProductCard";
import { Header }               from "@/components/layout/Header";
import { Footer }               from "@/components/layout/Footer";
import { ShopFilters }          from "@/components/product/ShopFilters";

const VALID: ProductCategory[] = ["denim", "dresses", "tops", "sets", "sale", "kids"];

const META: Record<ProductCategory, { heading: string; description: string }> = {
  denim:   { heading: "The Denim Edit",  description: "Denim dresses, jumpsuits, playsuits at Zira Fashions Lagos." },
  dresses: { heading: "Dresses",         description: "Beautiful dresses from UK & US highstreet brands at Zira Fashions." },
  tops:    { heading: "Tops",            description: "Tops from UK and US highstreet brands at Zira Fashions." },
  sets:    { heading: "Co-ords & Sets",  description: "Matching sets from UK and US highstreet brands at Zira Fashions." },
  sale:    { heading: "Sale",            description: "Sale items at Zira Fashions Lagos." },
  kids:    { heading: "Kids Collection", description: "Trendy UK & US brands for kids aged 0\u201316 at Zira Fashions." },
};

export function generateStaticParams() {
  return VALID.map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = params.category as ProductCategory;
  if (!VALID.includes(cat)) return { title: "Category Not Found" };
  const m = META[cat];
  return { title: m.heading, description: m.description };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category as ProductCategory;
  if (!VALID.includes(category)) notFound();
  const products = category === "sale" ? await getSaleProducts() : category === "kids" ? await getKidsProducts() : await getProductsByCategory(category);
  const m = META[category];
  const isKids = category === "kids";

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <div className="max-w-screen-xl mx-auto px-5 py-8 md:py-12">
          <div className="mb-8">
            <p className="section-label mb-1.5">{isKids ? "Zira Fashions Kids" : "Zira Fashions"}</p>
            <h1 className="font-display font-medium text-h1 text-text-primary">{m.heading}</h1>
            <p className="font-sans text-small text-text-muted mt-1">{products.length} item{products.length !== 1 ? "s" : ""}</p>
          </div>
          {!isKids && <Suspense><ShopFilters activeCategory={category} /></Suspense>}
          <div className="mt-6">
            <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">{Array.from({length:6}).map((_,i)=><ProductCardSkeleton key={i}/>)}</div>}>
              <ProductGridClient products={products} showTryOn={!isKids} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
