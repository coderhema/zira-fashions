import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Our Policy",
  description:
    "Zira Fashions returns, exchanges, and delivery policy. We keep things simple, fair, and transparent.",
};

const SECTIONS = [
  {
    title: "Returns & Exchanges",
    body: [
      "We want you to love every piece you buy from us. If something isn't right, please reach out to us within 48 hours of delivery via WhatsApp.",
      "Items must be unworn, unwashed, and in their original condition with all tags attached.",
      "Sale and pre-owned items are final sale and cannot be returned or exchanged.",
      "Exchanges are subject to stock availability. If your preferred size or item is unavailable, we will offer a store credit.",
    ],
  },
  {
    title: "Delivery",
    body: [
      "We deliver nationwide across Nigeria. Delivery times vary by location — typically 1–3 business days for Lagos, and 2–5 business days for other states.",
      "Delivery fees are calculated at checkout via WhatsApp based on your location and order size.",
      "Once your order is dispatched, we will share a tracking reference with you.",
    ],
  },
  {
    title: "Payments",
    body: [
      "We currently accept payment via bank transfer. Our account details are shared after your order is confirmed on WhatsApp.",
      "Payment must be received in full before your order is dispatched.",
    ],
  },
  {
    title: "Pre-Owned Items",
    body: [
      "All pre-owned items are clearly labelled and have been inspected for quality. Any notable wear or imperfections are disclosed before purchase.",
      "Pre-owned items are priced lower to reflect their condition and are final sale.",
    ],
  },
  {
    title: "Sold Out Items",
    body: [
      "If an item you want is sold out, you can tap “Notify Me” on the product page and we will contact you if it becomes available again.",
    ],
  },
];

export default function PolicyPage() {
  const contact = buildWhatsAppContactUrl("Hi Zira Fashions! I have a question about your policy.");

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section className="max-w-screen-xl mx-auto px-5 py-14 md:py-20">
          <p className="section-label mb-1.5">Transparency</p>
          <h1 className="font-display font-medium text-h1 text-text-primary mb-3">Our Policy</h1>
          <p className="font-sans text-body text-text-secondary leading-editorial max-w-lg mb-12">
            We keep things simple, fair, and transparent. If you have any questions not covered
            here, just send us a message on WhatsApp.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {SECTIONS.map(({ title, body }) => (
              <div key={title} className="p-6 rounded-card bg-surface border border-border">
                <h2 className="font-display font-medium text-[22px] text-text-primary mb-3">{title}</h2>
                <ul className="flex flex-col gap-2">
                  {body.map((line, i) => (
                    <li key={i} className="font-sans text-body text-text-secondary leading-editorial flex gap-3">
                      <span className="flex-shrink-0 mt-[6px] w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a href={contact} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Chat on WhatsApp
            </a>
            <Link href="/shop" className="btn-primary">
              Browse the Shop
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
