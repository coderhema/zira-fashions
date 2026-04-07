import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Zira Fashions. Chat with us on WhatsApp for orders, enquiries, or any questions.",
};

function WaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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
