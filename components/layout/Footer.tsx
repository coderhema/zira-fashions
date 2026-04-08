import Link from "next/link";
import { Whatsapp, Instagram } from "iconoir-react";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

const SHOP = [
  { label: "All Products", href: "/shop" },
  { label: "Denim",        href: "/shop/denim" },
  { label: "Dresses",      href: "/shop/dresses" },
  { label: "Tops",         href: "/shop/tops" },
  { label: "Kids",         href: "/kids" },
  { label: "Sale",         href: "/shop/sale" },
] as const;

const INFO = [
  { label: "How to Order", href: "/how-to-order" },
  { label: "Size Chart",   href: "/size-chart" },
  { label: "Our Policy",   href: "/policy" },
  { label: "About",        href: "/about" },
  { label: "Try On",       href: "/try-on" },
  { label: "Contact",      href: "/contact" },
] as const;

function WaIcon() {
  return <Whatsapp width={20} height={20} aria-hidden="true" />;
}

export function Footer() {
  const contact = buildWhatsAppContactUrl();
  const year    = new Date().getFullYear();

  return (
    <footer>
      <div className="bg-surface-muted border-t border-border">
        <div className="max-w-screen-xl mx-auto px-5 py-5 flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {[["Nationwide Delivery"], ["WhatsApp Orders"], ["Clear Policy"], ["Trusted by 35K+"]].map(([label]) => (
            <div key={label} className="flex items-center gap-2 font-sans text-small font-medium text-text-secondary">{label}</div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="max-w-screen-xl mx-auto px-5 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <div className="flex flex-col gap-4">
              <Link href="/" className="font-display font-medium text-[28px] text-white tracking-tight">Zira Fashions</Link>
              <p className="font-sans text-[14px] text-white/65 leading-editorial max-w-[240px]">
                Home for brand new &amp; pre-owned UK and US highstreet fashion. Nationwide delivery across Nigeria.
              </p>
              <div className="flex items-center gap-4 mt-1">
                <a href="https://www.instagram.com/zirafashions/" target="_blank" rel="noopener noreferrer"
                  aria-label="Instagram" className="text-white/50 hover:text-white transition-colors">
                  <Instagram width={20} height={20} aria-hidden="true" />
                </a>
                <a href={contact} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  className="text-white/50 hover:text-white transition-colors">
                  <WaIcon />
                </a>
              </div>
            </div>

            <div>
              <p className="font-sans font-semibold text-[11px] tracking-[0.08em] uppercase text-white/40 mb-4">Shop</p>
              <ul className="flex flex-col gap-2.5">
                {SHOP.map((l) => <li key={l.href}><Link href={l.href} className="font-sans text-[14px] text-white/70 hover:text-white transition-colors">{l.label}</Link></li>)}
              </ul>
            </div>

            <div>
              <p className="font-sans font-semibold text-[11px] tracking-[0.08em] uppercase text-white/40 mb-4">Info</p>
              <ul className="flex flex-col gap-2.5">
                {INFO.map((l) => <li key={l.href}><Link href={l.href} className="font-sans text-[14px] text-white/70 hover:text-white transition-colors">{l.label}</Link></li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-screen-xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-sans text-micro text-white/40">&copy; {year} Zira Fashions. Lagos, Nigeria.</p>
            <p className="font-sans text-micro text-white/30">Website by <a href="https://www.instagram.com/coderhema/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Coderhema</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
