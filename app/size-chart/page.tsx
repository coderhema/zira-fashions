import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Size Chart",
  description:
    "Size guide for Zira Fashions. Find your perfect fit across our denim, dresses, tops, sets and kids collections.",
};

const WOMEN = [
  { size: "XS", uk: "6–8",   bust: "80–84",  waist: "60–64", hips: "86–90" },
  { size: "S",  uk: "8–10",  bust: "84–88",  waist: "64–68", hips: "90–94" },
  { size: "M",  uk: "10–12", bust: "88–92",  waist: "68–72", hips: "94–98" },
  { size: "L",  uk: "12–14", bust: "92–96",  waist: "72–76", hips: "98–102" },
  { size: "XL", uk: "14–16", bust: "96–100", waist: "76–80", hips: "102–106" },
  { size: "XXL", uk: "16–18", bust: "100–104", waist: "80–84", hips: "106–110" },
];

const KIDS = [
  { age: "0–6 m",  height: "56–67", chest: "40–44" },
  { age: "6–12 m", height: "67–74", chest: "44–47" },
  { age: "1–2 y",  height: "74–86", chest: "47–52" },
  { age: "3–4 y",  height: "92–104", chest: "52–56" },
  { age: "5–6 y",  height: "104–116", chest: "56–60" },
  { age: "7–8 y",  height: "116–128", chest: "60–65" },
  { age: "9–10 y", height: "128–140", chest: "65–70" },
  { age: "11–12 y", height: "140–152", chest: "70–76" },
  { age: "13–16 y",height: "152–170", chest: "76–84" },
];

export default function SizeChartPage() {
  const contact = buildWhatsAppContactUrl("Hi Zira Fashions! I need help finding my size.");

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[68px]">
        <section className="max-w-screen-xl mx-auto px-5 py-14 md:py-20">
          <p className="section-label mb-1.5">Fit Guide</p>
          <h1 className="font-display font-medium text-h1 text-text-primary mb-3">Size Chart</h1>
          <p className="font-sans text-body text-text-secondary leading-editorial max-w-lg mb-12">
            All measurements are in centimetres (cm) unless otherwise stated. Sizes are based on
            UK sizing. If you&apos;re between sizes, we recommend sizing up. Still unsure? WhatsApp
            us and we&apos;ll help.
          </p>

          <div className="flex flex-col gap-12">
            {/* Women */}
            <div>
              <h2 className="font-display font-medium text-h2 text-text-primary mb-5">Women</h2>
              <div className="overflow-x-auto rounded-card border border-border">
                <table className="w-full font-sans text-small text-left">
                  <thead>
                    <tr className="bg-surface-muted border-b border-border">
                      <th className="px-4 py-3 font-semibold text-text-primary">Size</th>
                      <th className="px-4 py-3 font-semibold text-text-primary">UK Size</th>
                      <th className="px-4 py-3 font-semibold text-text-primary">Bust (cm)</th>
                      <th className="px-4 py-3 font-semibold text-text-primary">Waist (cm)</th>
                      <th className="px-4 py-3 font-semibold text-text-primary">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WOMEN.map((r, i) => (
                      <tr key={r.size} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
                        <td className="px-4 py-3 font-semibold text-text-primary">{r.size}</td>
                        <td className="px-4 py-3 text-text-secondary">{r.uk}</td>
                        <td className="px-4 py-3 text-text-secondary">{r.bust}</td>
                        <td className="px-4 py-3 text-text-secondary">{r.waist}</td>
                        <td className="px-4 py-3 text-text-secondary">{r.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kids */}
            <div>
              <h2 className="font-display font-medium text-h2 text-text-primary mb-5">Kids (Zira Kids)</h2>
              <div className="overflow-x-auto rounded-card border border-border">
                <table className="w-full font-sans text-small text-left">
                  <thead>
                    <tr className="bg-surface-muted border-b border-border">
                      <th className="px-4 py-3 font-semibold text-text-primary">Age</th>
                      <th className="px-4 py-3 font-semibold text-text-primary">Height (cm)</th>
                      <th className="px-4 py-3 font-semibold text-text-primary">Chest (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KIDS.map((r, i) => (
                      <tr key={r.age} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
                        <td className="px-4 py-3 font-semibold text-text-primary">{r.age}</td>
                        <td className="px-4 py-3 text-text-secondary">{r.height}</td>
                        <td className="px-4 py-3 text-text-secondary">{r.chest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a href={contact} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Need help with sizing? Chat on WhatsApp
            </a>
            <Link href="/shop" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
