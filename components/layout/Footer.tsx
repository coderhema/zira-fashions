import Link from "next/link";
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
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
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
            <p className="font-sans text-micro text-white/30">Website by Tolulope</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
