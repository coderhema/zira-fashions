"use client";
import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import type { SanityProduct } from "@/lib/sanity";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { Xmark } from "iconoir-react";

type Status = "idle" | "validating" | "processing" | "done" | "error";
interface Result { imageData: string; mimeType: string; }
interface Props { product: SanityProduct; siteUrl?: string; onClose: () => void; }

const MAX_MB = 10;
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,image/heic,.heic,.jpg,.jpeg,.png,.webp";

function Spinner() {
  return <div className="w-10 h-10 rounded-full border-[3px] border-border border-t-primary animate-spin" aria-hidden="true" />;
}

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function TryOnModal({ product, siteUrl, onClose }: Props) {
  const [status,   setStatus]   = useState<Status>("idle");
  const [result,   setResult]   = useState<Result | null>(null);
  const [errMsg,   setErrMsg]   = useState("");
  const [dragging, setDragging] = useState(false);
  const [preview,  setPreview]  = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const base     = siteUrl ?? "https://zirafashions.com";
  const pdpUrl   = `${base}/product/${product.slug}`;
  const orderUrl = buildWhatsAppOrderUrl({
    name: product.name, size: product.size, price: product.price,
    productUrl: pdpUrl, sku: product.sku, fromTryOn: true
  } as Parameters<typeof buildWhatsAppOrderUrl>[0]);

  const validate = (f: File): string | null => {
    if (!ACCEPT.includes(f.type) && !f.name.toLowerCase().endsWith(".heic"))
      return "Please upload a JPEG, PNG, WebP, or HEIC photo.";
    if (f.size > MAX_MB * 1024 * 1024) return `Photo must be under ${MAX_MB}MB.`;
    return null;
  };

  const processFile = useCallback(async (file: File) => {
    setStatus("validating"); setErrMsg("");
    const err = validate(file);
    if (err) { setErrMsg(err); setStatus("error"); return; }
    const local = URL.createObjectURL(file);
    setPreview(local); setStatus("processing");
    try {
      const fd = new FormData();
      fd.append("personImage", file);
      fd.append("garmentUrl",  product.tryOnGarmentUrl ?? product.imageUrl);
      fd.append("garmentName", product.name);
      const res = await fetch("/api/try-on", { method: "POST", body: fd });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error ?? `Error ${res.status}`); }
      const data: Result = await res.json();
      setResult(data); setStatus("done");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    } finally { URL.revokeObjectURL(local); }
  }, [product]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processFile(f); };
  const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); };
  const retry  = () => { setStatus("idle"); setResult(null); setErrMsg(""); setPreview(null); if (fileRef.current) fileRef.current.value = ""; };
  const save   = () => { if (!result) return; const a = document.createElement("a"); a.href = `data:${result.mimeType};base64,${result.imageData}`; a.download = `zira-tryon-${product.slug}.jpg`; a.click(); };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-primary/60 backdrop-blur-sm p-0 md:p-6"
      role="dialog" aria-modal="true" aria-label={`Try on ${product.name}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full md:max-w-lg bg-surface rounded-t-[20px] md:rounded-card shadow-[0_24px_80px_-16px_rgba(44,58,92,0.32)] max-h-[92vh] overflow-y-auto"
        style={{ animation: "modal-enter 200ms cubic-bezier(0.4,0,0.2,1) both" }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div>
            <p className="section-label mb-0.5">Virtual Try-On</p>
            <h2 className="font-sans font-semibold text-[17px] text-text-primary leading-tight">{product.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-muted transition-colors" aria-label="Close">
            <Xmark width={16} height={16} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          {status === "idle" && (
            <div className="flex flex-col gap-4">
              <p className="font-sans text-body text-text-secondary leading-editorial">Upload a full-length photo of yourself and see how this piece fits you.</p>
              <div onDrop={onDrop} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
                className={`flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed p-10 cursor-pointer transition-colors ${dragging ? "border-accent bg-accent-light" : "border-border bg-surface-muted hover:border-accent hover:bg-accent-light"}`}
                onClick={() => fileRef.current?.click()} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
                aria-label="Upload your photo">
                <span className="text-4xl select-none" aria-hidden="true">📸</span>
                <div className="text-center">
                  <p className="font-sans font-medium text-[15px] text-text-primary">Upload your photo</p>
                  <p className="font-sans text-small text-text-muted mt-1">JPEG, PNG, WebP or HEIC · Max {MAX_MB}MB</p>
                </div>
                <input ref={fileRef} type="file" accept={ACCEPT_ATTR} onChange={onFile} className="sr-only" aria-hidden="true" />
              </div>
              <button type="button" onClick={() => { if (fileRef.current) { fileRef.current.setAttribute("capture", "user"); fileRef.current.click(); }}} className="btn-secondary h-11 text-[14px]">Use Camera</button>
              <p className="font-sans text-small text-text-muted text-center">Best results: full-body shot, good lighting, plain background.</p>
            </div>
          )}

          {status === "processing" && (
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-full aspect-product rounded-card overflow-hidden bg-surface-muted">
                {preview && <Image src={preview} alt="Your photo" fill className="object-cover object-top opacity-40" unoptimized />}
                <div className="absolute inset-0 skeleton opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Spinner />
                  <p className="font-sans font-medium text-[14px] text-text-secondary">Generating your look…</p>
                  <p className="font-sans text-small text-text-muted">This takes 10–20 seconds</p>
                </div>
              </div>
            </div>
          )}

          {status === "done" && result && (
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-product rounded-card overflow-hidden bg-surface-muted" style={{ animation: "result-fadein 400ms ease both" }}>
                <Image src={`data:${result.mimeType};base64,${result.imageData}`} alt={`Try-on: ${product.name}`} fill className="object-cover object-top" unoptimized />
              </div>
              <p className="font-sans text-small text-text-muted text-center leading-editorial">
                AI-generated preview. Actual fit may vary &mdash; see the <a href="/size-chart" className="underline hover:text-text-secondary">size chart</a>.
              </p>
              <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center">
                <WaIcon size={18} />Order This Look on WhatsApp
              </a>
              <div className="flex gap-3">
                <button type="button" onClick={save} className="btn-secondary flex-1 h-11 text-[14px]">Save Photo</button>
                <button type="button" onClick={retry} className="flex-1 h-11 rounded-pill font-sans font-medium text-[14px] text-text-secondary border border-border hover:border-border-strong transition-colors">Try Another</button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-5 py-4">
              <span className="text-5xl" aria-hidden="true">😕</span>
              <div className="text-center">
                <p className="font-sans font-medium text-[15px] text-text-primary mb-1">Try-on didn&apos;t work this time</p>
                <p className="font-sans text-small text-text-secondary leading-editorial max-w-xs">{errMsg || "Something went wrong. Please try again."}</p>
              </div>
              <button type="button" onClick={retry} className="btn-primary h-11 text-[14px]">Try Again</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modal-enter   { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes result-fadein { from{opacity:0} to{opacity:1} }
        @media(prefers-reduced-motion:reduce){
          @keyframes modal-enter   {from{opacity:0}to{opacity:1}}
          @keyframes result-fadein {from{opacity:0}to{opacity:1}}
        }
      `}</style>
    </div>
  );
}
