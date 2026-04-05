import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "How to Order",
  description:
    "Learn how to order from Zira Fashions via WhatsApp. Simple steps to get your favourite UK and US highstreet fashion delivered nationwide.",
};

const STEPS = [
  {
    step: "1",
    title: "Browse the Shop",
    body: "Explore our collection online. Filter by category — denim, dresses, tops, sets, kids, or sale items.",
  },
  {
    step: "2",
    title: "Pick Your Item",
    body: "Found something you love? Tap \u201cOrder on WhatsApp\u201d on the product page to send us a pre-filled message.",
  },
  {
    step: "3",
    title: "Confirm Your Order",
    body: "We'll confirm availability, your size, and your delivery address via WhatsApp chat.",
  },
  {
    step: "4",
    title: "Make Payment",
    body: "Payment is made via bank transfer. We'll send you our account details once your order is confirmed.",
  },
  {
    step: "5",
    title: "Get It Delivered",
    body: "We dispatch your order and share tracking details. We deliver nationwide across Nigeria.",
  },
];

export default function HowToOrderPage() {
  const contact = buildWhatsAppContactUrl("Hi Zira Fashions! I'd like to place an order 🛍️");

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section className="max-w-screen-xl mx-auto px-5 py-14 md:py-20">
          <p className="section-label mb-1.5">Ordering Guide</p>
          <h1 className="font-display font-medium text-h1 text-text-primary mb-3">How to Order</h1>
          <p className="font-sans text-body text-text-secondary leading-editorial max-w-lg mb-12">
            Ordering from Zira Fashions is simple and fast. Follow the steps below or just send us
            a WhatsApp message — we&apos;ll guide you through everything.
          </p>

          <div className="flex flex-col gap-6 max-w-2xl">
            {STEPS.map(({ step, title, body }) => (
              <div key={step} className="flex gap-5 p-6 rounded-card bg-surface border border-border">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-sans font-semibold text-[15px] text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  aria-hidden="true"
                >
                  {step}
                </div>
                <div>
                  <p className="font-sans font-semibold text-[15px] text-text-primary mb-1">{title}</p>
                  <p className="font-sans text-small text-text-secondary leading-editorial">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a href={contact} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              Order on WhatsApp
            </a>
            <Link href="/shop" className="btn-secondary">
              Browse the Shop
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
