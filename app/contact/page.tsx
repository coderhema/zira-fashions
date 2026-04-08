import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";
import { Whatsapp } from "iconoir-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Zira Fashions. Chat with us on WhatsApp for orders, enquiries, or any questions.",
};

function WaIcon() {
  return <Whatsapp width={22} height={22} aria-hidden="true" />;
}

export default function ContactPage() {
  const order   = buildWhatsAppContactUrl("Hi Zira Fashions! I'd like to place an order 🛍️");
  const general = buildWhatsAppContactUrl("Hi Zira Fashions! I have a question.");
  const returns = buildWhatsAppContactUrl("Hi Zira Fashions! I'd like to enquire about a return or exchange.");

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section className="max-w-screen-xl mx-auto px-5 py-14 md:py-20">
          <p className="section-label mb-1.5">Get in Touch</p>
          <h1 className="font-display font-medium text-h1 text-text-primary mb-3">Contact Us</h1>
          <p className="font-sans text-body text-text-secondary leading-editorial max-w-lg mb-12">
            The fastest way to reach us is on WhatsApp. We&apos;re usually online and respond
            within a few hours. Choose a topic below to get started.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl">
            {[
              { title: "Place an Order", body: "Ready to buy? Send us a WhatsApp message and we'll confirm your order right away.", href: order },
              { title: "General Enquiry", body: "Have a question about a product, delivery, or anything else? We're here to help.", href: general },
              { title: "Returns & Exchanges", body: "Something not right? Chat with us and we'll sort it out as quickly as possible.", href: returns },
            ].map(({ title, body, href }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-4 p-6 rounded-card bg-surface border border-border hover:border-primary hover:shadow-sm transition-all duration-[180ms] group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-[180ms]"
                  style={{ backgroundColor: "var(--color-whatsapp)" }}
                >
                  <WaIcon />
                </div>
                <div>
                  <p className="font-sans font-semibold text-[15px] text-text-primary mb-1">{title}</p>
                  <p className="font-sans text-small text-text-secondary leading-editorial">{body}</p>
                </div>
                <span className="font-sans font-medium text-small mt-auto" style={{ color: "var(--color-whatsapp)" }}>
                  Chat on WhatsApp →
                </span>
              </a>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-card bg-surface-muted border border-border max-w-lg">
            <p className="font-sans font-semibold text-[14px] text-text-primary mb-1">📍 Based in Lagos, Nigeria</p>
            <p className="font-sans text-small text-text-secondary leading-editorial">
              We operate online and deliver nationwide across Nigeria. Visit our Instagram{" "}
              <a
                href="https://www.instagram.com/zirafashions/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-text-primary transition-colors"
              >
                @zirafashions
              </a>{" "}
              to see our latest arrivals and customer photos.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
