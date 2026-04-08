"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";
import { Search, Xmark, Menu } from "iconoir-react";

const NAV = [
  { label: "Shop",   href: "/shop" },
  { label: "Denim",  href: "/shop/denim" },
  { label: "Kids",   href: "/kids" },
  { label: "Try On", href: "/try-on" },
  { label: "About",  href: "/about" },
] as const;

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const contact = buildWhatsAppContactUrl();

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 h-16 md:h-[68px] transition-all duration-[280ms] ${
        scrolled ? "bg-surface shadow-[0_2px_20px_-4px_rgba(44,58,92,0.12)]" : "bg-transparent"
      }`}>
        <div className="max-w-screen-xl mx-auto h-full px-5 md:px-8 flex items-center justify-between">
          <Link href="/" className={`font-display font-medium text-[22px] md:text-[26px] tracking-tight transition-colors duration-[180ms] ${
            scrolled ? "text-text-primary" : "text-white"
          }`}>Zira Fashions</Link>

          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href}
                className={`relative font-sans font-medium text-[14px] tracking-wide transition-colors duration-[180ms] after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-[width] after:duration-[180ms] hover:after:w-full ${
                  scrolled ? "text-text-secondary hover:text-text-primary" : "text-white/85 hover:text-black"
                }`}>{l.label}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href={contact} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className={`transition-colors hover:opacity-70 ${scrolled ? "text-primary" : "text-white"}`}>
              <WaIcon />
            </a>
            <Link href="/search" aria-label="Search"
              className={`transition-colors hover:opacity-70 ${scrolled ? "text-text-secondary" : "text-white"}`}>
              <Search width={20} height={20} aria-hidden="true" />
            </Link>
          </div>

          <button type="button" onClick={() => setOpen(true)}
            className={`md:hidden flex items-center justify-center p-2 transition-colors ${scrolled ? "text-text-primary" : "text-white hover:text-black"}`}
            aria-label="Open menu" aria-expanded={open}>
            <Menu width={24} height={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-[240ms] ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        style={{ background: "rgba(44,58,92,0.5)", backdropFilter: "blur(4px)" }}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-[320px] md:hidden flex flex-col transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--color-primary)" }}
        role="dialog" aria-modal="true" aria-label="Navigation menu"
      >
        <div className="flex justify-end p-5">
          <button type="button" onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white p-2 transition-colors" aria-label="Close menu">
            <Xmark width={20} height={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col px-8 pb-8 gap-1 flex-1" aria-label="Mobile navigation">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="font-display font-medium text-[36px] text-white/90 hover:text-white leading-tight py-2 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-8 pb-10">
          <a href={contact} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans font-medium text-[14px] text-white/70 hover:text-white transition-colors"
            onClick={() => setOpen(false)}>
            <WaIcon /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
