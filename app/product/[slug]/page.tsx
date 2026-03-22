import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/lib/sanity";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PDPClient } from "@/components/product/PDPClient";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zirafashions.com";
  const ogUrl   = new URL("/api/og", siteUrl);
  ogUrl.searchParams.set("name",  product.name);
  ogUrl.searchParams.set("price", product.price);
  ogUrl.searchParams.set("size",  product.size);
  if (product.imageUrl)       ogUrl.searchParams.set("image", product.imageUrl);
  if (product.isSoldOut)      ogUrl.searchParams.set("badge", "sold-out");
  else if (product.originalPrice) ogUrl.searchParams.set("badge", "sale");
  else if (product.isNew)     ogUrl.searchParams.set("badge", "new");

  const title       = `${product.name} \u2014 ${product.size}`;
  const description = `${product.price} \u00b7 Size ${product.size} \u00b7 Zira Fashions. DM to order. Nationwide delivery.`;

  return {
    title,
    description,
    openGraph: {
      title, description,
      url:    `${siteUrl}/product/${product.slug}`,
      type:   "website",
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: product.name }]
    },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function PDPPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zirafashions.com";

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <nav className="max-w-screen-xl mx-auto px-5 pt-6 pb-2" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 font-sans text-small text-text-muted">
            <li><a href="/" className="hover:text-text-secondary transition-colors">Home</a></li>
            <li aria-hidden="true">&middot;</li>
            <li><a href="/shop" className="hover:text-text-secondary transition-colors">Shop</a></li>
            <li aria-hidden="true">&middot;</li>
            <li className="text-text-secondary truncate max-w-[180px]">{product.name}</li>
          </ol>
        </nav>
        <PDPClient product={product} siteUrl={siteUrl} />
        <div className="max-w-screen-xl mx-auto px-5 py-12 border-t border-border">
          <a href="/shop" className="inline-flex items-center gap-2 font-sans font-medium text-[14px] text-text-secondary hover:text-text-primary transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M10 4 6 8l4 4" />
            </svg>
            Back to all products
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
