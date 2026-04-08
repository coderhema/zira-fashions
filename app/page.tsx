import Link         from "next/link";
import { Suspense } from "react";
import { getFeaturedProducts }  from "@/lib/sanity";
import { ProductGridClient }    from "@/components/product/ProductGridClient";
import { ProductCardSkeleton }  from "@/components/product/ProductCard";
import { Header }               from "@/components/layout/Header";
import { Footer }               from "@/components/layout/Footer";
import { DeliveryTruck, ChatBubble, Undo, Star, Sparks } from "iconoir-react";

const CATS = [
  { label: "All",     href: "/shop"         },
  { label: "Denim",   href: "/shop/denim"   },
  { label: "Dresses", href: "/shop/dresses" },
  { label: "Tops",    href: "/shop/tops"    },
  { label: "Sets",    href: "/shop/sets"    },
  { label: "Sale",    href: "/shop/sale", sale: true }
] as const;

export default async function HomePage() {
  const products = await getFeaturedProducts(6);

  return (
    <>
      <Header darkHero />
      <main>
        {/* Hero */}
        <section className="relative w-full h-[85svh] md:h-screen min-h-[520px] max-h-[900px] flex items-end overflow-hidden bg-primary" aria-label="Hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.jpg" alt="Model wearing a Zira Fashions denim jumpsuit"
            className="absolute inset-0 w-full h-full object-cover object-center" fetchPriority="high" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top,rgba(44,58,92,0.72) 0%,rgba(44,58,92,0.12) 50%,transparent 100%)" }}
            aria-hidden="true" />
          <div className="relative w-full px-5 pb-10 md:px-12 md:pb-14 flex flex-col items-center md:items-start gap-4 max-w-screen-xl mx-auto">
            <p className="section-label" style={{ color: "#C9A090" }}>Highstreet UK &amp; US Brands · Lagos</p>
            <h1 className="font-display font-light text-white text-display leading-display max-w-md text-center md:text-left">
              Wear what<br />Lagos loves.
            </h1>
            <p className="font-sans text-[17px] text-white/85 leading-editorial max-w-xs text-center md:text-left">
              Brand new &amp; pre-owned fashion, delivered nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-1 w-full sm:w-auto">
              <Link href="/shop" className="btn-whatsapp w-full sm:w-auto justify-center">Shop New Arrivals</Link>
              <Link href="/shop/denim"
                className="btn-secondary border-white/60 hover:bg-white/10 hover:border-white w-full sm:w-auto justify-center"
                style={{ color: "white" }}>
                Denim Edit
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="bg-surface-muted border-y border-border">
          <div className="max-w-screen-xl mx-auto px-5 py-4 flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {[
              { icon: <DeliveryTruck width={18} height={18} />, label: "Nationwide Delivery" },
              { icon: <ChatBubble width={18} height={18} />, label: "WhatsApp Orders" },
              { icon: <Undo width={18} height={18} />, label: "Clear Policy" },
              { icon: <Star width={18} height={18} />, label: "Trusted by 35K+" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 font-sans text-small font-medium text-text-secondary whitespace-nowrap">
                <span aria-hidden="true">{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-screen-xl mx-auto px-5 pt-10 md:pt-14">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATS.map((c) => (
              <Link key={c.href} href={c.href}
                className={`flex-shrink-0 px-4 py-2 rounded-pill border font-sans font-medium text-small transition-colors duration-[180ms]
                  ${"sale" in c && c.sale
                    ? "border-sale text-sale hover:bg-sale hover:text-white"
                    : "border-border text-text-secondary bg-surface hover:border-primary hover:text-primary"}`}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Denim Edit header */}
        <section className="max-w-screen-xl mx-auto px-5 pt-14 md:pt-20" aria-label="Denim Edit">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
            <div>
              <p className="section-label mb-1.5">Core Category</p>
              <h2 className="font-display font-medium text-h2 text-text-primary">The Denim Edit</h2>
            </div>
            <Link href="/shop/denim" className="font-sans font-medium text-[14px] text-primary underline underline-offset-4 hover:text-primary-hover transition-colors">
              See all denim →
            </Link>
          </div>
        </section>

        {/* Featured grid */}
        <section className="max-w-screen-xl mx-auto px-5 pb-14 md:pb-20" aria-label="Featured products">
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          }>
            <ProductGridClient products={products} showTryOn />
          </Suspense>
          <div className="flex justify-center mt-10">
            <Link href="/shop" className="btn-secondary">View All Products</Link>
          </div>
        </section>

        {/* Try-On callout */}
        <section className="w-full py-16 md:py-20" style={{ backgroundColor: "var(--color-accent-light)" }} aria-label="Virtual try-on">
          <div className="max-w-screen-xl mx-auto px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-lg">
              <p className="section-label mb-2">New Feature</p>
              <h2 className="font-display font-medium text-h2 text-text-primary mb-4">Try it on before you order.</h2>
              <p className="font-sans text-body text-text-secondary leading-editorial">
                Upload a photo of yourself and our AI shows you how any piece looks on your body — before you send that WhatsApp message.
              </p>
            </div>
            <Link href="/try-on" className="btn-primary flex-shrink-0 self-start md:self-auto flex items-center gap-2"><Sparks width={16} height={16} aria-hidden="true" />Try It Now</Link>
          </div>
        </section>

        {/* Kids banner */}
        <section className="max-w-screen-xl mx-auto px-5 py-14 md:py-20" aria-label="Kids collection">
          <div className="rounded-[20px] p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            style={{ backgroundColor: "var(--color-kids-accent)" }}>
            <div>
              <p className="font-sans font-semibold text-[11px] tracking-[0.08em] uppercase text-white/80 mb-1.5">Sub-brand</p>
              <h2 className="font-display font-medium text-h2 text-white leading-tight">Zira Kids</h2>
              <p className="font-sans text-[15px] text-white/85 leading-editorial mt-2 max-w-xs">
                Trendy UK &amp; US brands for little ones, age 0–16.
              </p>
            </div>
            <Link href="/kids"
              className="flex-shrink-0 self-start md:self-auto px-6 py-3 rounded-pill bg-white font-sans font-semibold text-[14px] hover:bg-white/90 hover:scale-[1.02] transition-all"
              style={{ color: "var(--color-kids-accent)" }}>
              Shop Kids →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
