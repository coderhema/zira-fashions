import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";
import { DeliveryTruck, ChatBubble, Undo, Star } from "iconoir-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Zira Fashions — your home for brand new and pre-owned UK and US highstreet fashion in Lagos, Nigeria. Nationwide delivery.",
};

export default function AboutPage() {
  const contact = buildWhatsAppContactUrl("Hi Zira Fashions! I'd love to learn more about you.");

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section className="max-w-screen-xl mx-auto px-5 py-14 md:py-20">
          <p className="section-label mb-1.5">Our Story</p>
          <h1 className="font-display font-medium text-h1 text-text-primary mb-6 max-w-lg">
            Home for highstreet fashion in Lagos.
          </h1>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-10">
            <div className="flex flex-col gap-5 font-sans text-body text-text-secondary leading-editorial">
              <p>
                Zira Fashions is Lagos&apos;s destination for brand new and pre-owned UK and US
                highstreet brands. We bring the best of international fashion directly to your
                doorstep — at prices that make sense.
              </p>
              <p>
                From denim dresses and jumpsuits to co-ord sets and tops, every piece is carefully
                sourced and quality-checked before it reaches you. We also carry a dedicated kids
                line, Zira Kids, for little ones aged 0&ndash;16.
              </p>
              <p>
                Orders are placed via WhatsApp, and we deliver nationwide across Nigeria. Trusted
                by over 35,000 happy customers, we&apos;re proud to make international style
                accessible for everyone.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: <DeliveryTruck width={24} height={24} />, title: "Nationwide Delivery", body: "We deliver to every state in Nigeria. Fast, reliable, and trackable." },
                { icon: <ChatBubble width={24} height={24} />, title: "WhatsApp Orders", body: "Simply DM us on WhatsApp to place your order. No complicated checkout." },
                { icon: <Undo width={24} height={24} />, title: "Clear Return Policy", body: "We stand behind every item we sell. Questions? Just ask us." },
                { icon: <Star width={24} height={24} />, title: "Trusted by 35K+", body: "Join thousands of satisfied customers who shop with Zira Fashions." },
              ].map(({ icon, title, body }) => (
                <div key={title} className="flex gap-4 p-5 rounded-card bg-surface border border-border">
                  <span className="flex-shrink-0 text-text-secondary" aria-hidden="true">{icon}</span>
                  <div>
                    <p className="font-sans font-semibold text-[15px] text-text-primary mb-1">{title}</p>
                    <p className="font-sans text-small text-text-secondary leading-editorial">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="btn-primary">Browse the Shop</Link>
            <a href={contact} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
