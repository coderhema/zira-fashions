"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Trash,
  CheckCircle,
  XmarkCircle,
  NavArrowDown,
  NavArrowRight,
  WarningCircle,
  EditPencil,
  Check,
  Xmark,
} from "iconoir-react";
import type { SanityProduct } from "@/lib/sanity";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// ─── Toast component ─────────────────────────────────────────────────────────

function ToastBar({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg font-sans text-[14px] font-medium border ${
            t.type === "success"
              ? "bg-surface border-border text-text-primary"
              : "bg-sale/10 border-sale/30 text-sale"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle width={18} height={18} className="text-green-600 flex-shrink-0" />
          ) : (
            <XmarkCircle width={18} height={18} className="text-sale flex-shrink-0" />
          )}
          <span>{t.message}</span>
          <button
            type="button"
            className="ml-2 text-text-muted hover:text-text-primary transition-colors"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
          >
            <Xmark width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-xl border border-border overflow-hidden">
          <div className="h-12 bg-surface-muted" />
          <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-surface-muted" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Inline name editor ───────────────────────────────────────────────────────

function NameEditor({
  id,
  current,
  onSave,
}: {
  id: string;
  current: string;
  onSave: (id: string, name: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [saving, setSaving] = useState(false);

  async function commit() {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === current) { setEditing(false); return; }
    setSaving(true);
    await onSave(id, trimmed);
    setSaving(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <span className="flex items-center gap-1 group">
        <span className="font-sans text-[13px] text-text-secondary truncate max-w-[120px]">{current}</span>
        <button
          type="button"
          onClick={() => { setDraft(current); setEditing(true); }}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary transition-all"
          aria-label={`Edit name: ${current}`}
        >
          <EditPencil width={12} height={12} />
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <input
        autoFocus
        className="font-sans text-[13px] border border-border rounded px-1 py-0.5 w-[120px] bg-surface text-text-primary focus:outline-none focus:border-primary"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
        disabled={saving}
      />
      <button
        type="button"
        onClick={commit}
        disabled={saving}
        className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
        aria-label="Save name"
      >
        <Check width={14} height={14} />
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        disabled={saving}
        className="text-text-muted hover:text-text-primary transition-colors"
        aria-label="Cancel edit"
      >
        <Xmark width={14} height={14} />
      </button>
    </span>
  );
}

// ─── Product thumbnail card ────────────────────────────────────────────────────

function ProductThumb({
  product,
  onDelete,
  onRename,
}: {
  product: SanityProduct;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function doDelete() {
    setDeleting(true);
    onDelete(product._id);
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border bg-surface">
      <div className="aspect-[3/4] relative bg-surface-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width:640px) 33vw, (max-width:1024px) 16vw, 12vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">👗</div>
        )}

        {/* Delete button */}
        {!confirming && !deleting && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-red-50 text-red-500 rounded-full p-1.5 shadow"
            aria-label={`Delete ${product.name}`}
          >
            <Trash width={14} height={14} />
          </button>
        )}

        {/* Confirm delete overlay */}
        {confirming && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-2">
            <WarningCircle width={22} height={22} className="text-white" />
            <p className="font-sans text-[11px] text-white text-center font-medium">Delete?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={doDelete}
                disabled={deleting}
                className="px-3 py-1 rounded-full bg-red-500 text-white font-sans text-[11px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "…" : "Yes"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-3 py-1 rounded-full bg-white/20 text-white font-sans text-[11px] font-medium hover:bg-white/30 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 pb-2.5">
        <NameEditor id={product._id} current={product.name} onSave={onRename} />
        <p className="font-sans text-[12px] text-text-muted mt-0.5">{product.price}</p>
      </div>
    </div>
  );
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({
  category,
  products,
  onDelete,
  onRename,
}: {
  category: string;
  products: SanityProduct[];
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(true);
  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-surface hover:bg-surface-muted transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-sans font-semibold text-[15px] text-text-primary">
          {open ? (
            <NavArrowDown width={16} height={16} className="text-text-muted" />
          ) : (
            <NavArrowRight width={16} height={16} className="text-text-muted" />
          )}
          {label}
        </span>
        <span className="font-sans text-small text-text-muted bg-surface-muted px-2.5 py-0.5 rounded-full">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </span>
      </button>

      {open && (
        <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 bg-background">
          {products.map((p) => (
            <ProductThumb key={p._id} product={p} onDelete={onDelete} onRename={onRename} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounterRef = useRef(0);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = ++toastCounterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // Fetch all products on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Fetch failed");
        setProducts(data.products ?? []);
      } catch (e) {
        addToast(e instanceof Error ? e.message : "Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [addToast]);

  // Delete handler
  const handleDelete = useCallback(async (id: string) => {
    let original: SanityProduct[] = [];
    // Optimistic remove
    setProducts((prev) => { original = prev; return prev.filter((p) => p._id !== id); });
    try {
      const res = await fetch(`/api/admin/product?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      addToast("Product deleted", "success");
    } catch (e) {
      setProducts(original);
      addToast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }, [addToast]);

  // Rename handler
  const handleRename = useCallback(async (id: string, name: string) => {
    let original: SanityProduct[] = [];
    setProducts((prev) => { original = prev; return prev.map((p) => p._id === id ? { ...p, name } : p); });
    try {
      const res = await fetch("/api/admin/product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Rename failed");
      addToast("Name updated", "success");
    } catch (e) {
      setProducts(original);
      addToast(e instanceof Error ? e.message : "Rename failed", "error");
    }
  }, [addToast]);

  // Group by category
  const grouped = products.reduce<Record<string, SanityProduct[]>>((acc, p) => {
    const cat: string = p.category ?? "uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <>
      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">
        <div className="mb-8">
          <p className="section-label mb-1.5">Admin</p>
          <h1 className="font-display font-medium text-h1 text-text-primary">Upload History</h1>
          {!loading && (
            <p className="font-sans text-small text-text-muted mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} across {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>

        {loading ? (
          <Skeleton />
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-muted">
            <span className="text-5xl">📦</span>
            <p className="font-sans font-medium text-[16px]">No products uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <CategorySection
                key={cat}
                category={cat}
                products={grouped[cat]}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </div>

      <ToastBar toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
