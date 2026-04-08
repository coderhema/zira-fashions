"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";
import { Search, Xmark, Menu, Whatsapp } from "iconoir-react";

const NAV = [
  { label: "Shop",   href: "/shop" },
  { label: "Denim",  href: "/shop/denim" },
  { label: "Kids",   href: "/kids" },
  { label: "Try On", href: "/try-on" },
  { label: "About",  href: "/about" },
] as const;

function WaIcon() {
  return <Whatsapp width={20} height={20} aria-hidden="true" />;
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
          <Link href="/" aria-label="Zira Fashions"
            className={`font-serif text-2xl font-semibold tracking-wide transition-colors duration-[180ms] ${
              scrolled ? "text-text-primary" : "text-white"
            }`}>
            Zira
          </Link>

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
