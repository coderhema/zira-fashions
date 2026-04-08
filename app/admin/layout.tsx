"use client";
import Link from "next/link";
import { useState } from "react";
import { Settings, Menu, Xmark } from "iconoir-react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Instagram Import", href: "/admin/instagram-import" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin top bar */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display text-xl font-semibold text-primary tracking-wide">
              Zira
            </Link>
            <span className="text-border">/</span>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Settings width={15} height={15} aria-hidden="true" />
              <span className="font-sans text-small font-medium">Admin</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Admin navigation">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-small font-medium px-3 py-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu width={22} height={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        style={{ background: "rgba(44,58,92,0.45)", backdropFilter: "blur(3px)" }}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[75vw] max-w-[280px] md:hidden flex flex-col bg-surface border-l border-border shadow-xl transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation menu"
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <span className="font-display text-lg font-semibold text-primary tracking-wide">Admin</span>
          <button
            type="button"
            className="p-2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <Xmark width={20} height={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1" aria-label="Admin mobile navigation">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-sans text-[15px] font-medium px-4 py-2.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
