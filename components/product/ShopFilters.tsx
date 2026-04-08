"use client";

import { useRouter } from "next/navigation";
import type { ProductCategory } from "@/lib/sanity";

const FILTERS = [
  { label: "All",     value: "all"     },
  { label: "Denim",   value: "denim"   },
  { label: "Dresses", value: "dresses" },
  { label: "Tops",    value: "tops"    },
  { label: "Sets",    value: "sets"    },
  { label: "Kids",    value: "kids"    },
  { label: "Sale",    value: "sale"    },
] as const;

type FilterValue = ProductCategory | "all";

interface Props { activeCategory: ProductCategory | null; }

export function ShopFilters({ activeCategory }: Props) {
  const router = useRouter();

  function setCategory(value: FilterValue) {
    if (value === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${value}`);
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="group" aria-label="Filter by category">
      {FILTERS.map((f) => {
        const isActive = f.value === "all" ? !activeCategory : activeCategory === f.value;
        return (
          <button key={f.value} type="button" onClick={() => setCategory(f.value as FilterValue)}
            className={`flex-shrink-0 px-4 py-2 rounded-pill border font-sans font-medium text-small transition-colors duration-[180ms] ${
              isActive ? "bg-primary text-white border-primary"
              : f.value === "sale" ? "border-sale text-sale hover:bg-sale hover:text-white"
              : "border-border text-text-secondary hover:border-primary hover:text-primary bg-surface"
            }`}
            aria-pressed={isActive}>
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
