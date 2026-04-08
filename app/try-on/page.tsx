import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/sanity";
import { TryOnGridClient } from "@/components/tryon/TryOnGridClient";
import { ProductCardSkeleton } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sparks } from "iconoir-react";

export const metadata: Metadata = {
  title: "Virtual Try-On",
  description: "Upload a photo and see how Zira Fashions pieces look on you before ordering. AI-powered virtual try-on \u2014 free, no sign-up needed.",
};

export default async function TryOnPage() {
  const all     = await getAllProducts();
  const tryOns  = all.filter((p) => !p.isKids && !p.isSoldOut && !!p.tryOnGarmentUrl);
  const display = tryOns.length > 0 ? tryOns : all.filter((p) => !p.isKids && !p.isSoldOut).slice(0, 12);

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section className="w-full py-14 md:py-20" style={{ backgroundColor: "var(--color-accent-light)" }} aria-label="Virtual try-on intro">
          <div className="max-w-screen-xl mx-auto px-5 text-center flex flex-col items-center gap-5">
            <p className="section-label">New Feature</p>
            <h1 className="font-display font-medium text-h1 text-text-primary max-w-lg">
              See it on you before you order.
            </h1>
            <p className="font-sans text-body text-text-secondary leading-editorial max-w-md">
              Pick any piece below, upload a photo of yourself, and our AI will show you exactly how it fits \u2014 before you tap that WhatsApp button.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-xl">
              {[{ step: "1", label: "Pick a piece" }, { step: "2", label: "Upload your photo" }, { step: "3", label: "See the fit \u2014 then order" }].map(({ step, label }) => (
                <div key={step} className="flex-1 flex flex-col items-center gap-2 bg-surface rounded-card p-4 border border-border">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-[14px] text-white"
                    style={{ backgroundColor: "var(--color-accent)" }} aria-hidden="true">{step}</span>
                  <p className="font-sans font-medium text-[14px] text-text-primary text-center">{label}</p>
                </div>
              ))}
            </div>
            <p className="font-sans text-small text-text-muted max-w-sm leading-editorial">
              Best results: full-body photo, good lighting, plain background. AI-generated preview.
            </p>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-5 py-10 md:py-14" aria-label="Select a product to try on">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="section-label mb-1.5">Step 1</p>
              <h2 className="font-display font-medium text-h2 text-text-primary">Pick a piece to try on</h2>
            </div>
            <a href="/shop" className="font-sans font-medium text-[14px] text-primary underline underline-offset-4 hover:text-primary-hover transition-colors self-end pb-0.5">
              View all \u2192
            </a>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          }>
            <TryOnGridClient products={display} />
          </Suspense>
          {display.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Sparks width={48} height={48} aria-hidden="true" className="text-text-muted" />
              <p className="font-sans font-medium text-[16px] text-text-secondary">Try-on coming soon.</p>
              <a href="/shop" className="btn-primary mt-2">Browse the Shop</a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
