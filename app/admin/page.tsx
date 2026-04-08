import Link from "next/link";
import { Instagram, Settings } from "iconoir-react";

const TOOLS = [
  {
    href: "/admin/instagram-import",
    icon: <Instagram width={24} height={24} aria-hidden="true" />,
    title: "Instagram Import",
    description: "Import Instagram posts and add them as draft products.",
  },
] as const;

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-10">
        <Settings width={22} height={22} className="text-text-muted" aria-hidden="true" />
        <div>
          <h1 className="font-sans font-semibold text-h3 text-text-primary leading-tight">
            Admin Dashboard
          </h1>
          <p className="font-sans text-small text-text-muted mt-0.5">
            Manage products and content for Zira Fashions.
          </p>
        </div>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-4 p-5 rounded-card bg-surface border border-border hover:border-primary hover:shadow-sm transition-all duration-150"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent group-hover:bg-primary group-hover:text-white transition-colors">
              {tool.icon}
            </div>
            <div className="min-w-0">
              <p className="font-sans font-semibold text-body text-text-primary group-hover:text-primary transition-colors">
                {tool.title}
              </p>
              <p className="font-sans text-small text-text-muted mt-0.5 leading-snug">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Back to site link */}
      <div className="mt-12 pt-6 border-t border-border">
        <Link
          href="/"
          className="font-sans text-small font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
