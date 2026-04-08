import Link from "next/link";
import { Settings } from "iconoir-react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Instagram Import", href: "/admin/instagram-import" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin top bar */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl font-semibold text-primary tracking-wide">
              Zira
            </Link>
            <span className="text-border">/</span>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Settings width={15} height={15} aria-hidden="true" />
              <span className="font-sans text-small font-medium">Admin</span>
            </div>
          </div>

          <nav className="flex items-center gap-1" aria-label="Admin navigation">
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
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
