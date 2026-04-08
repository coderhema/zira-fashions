"use client";

import { useState, useCallback } from "react";
import {
  Instagram,
  Search,
  CloudUpload,
  CheckCircle,
  XmarkCircle,
  WarningCircle,
  MediaImageList,
  SelectWindow,
  Xmark,
} from "iconoir-react";

interface Post {
  id: string;
  thumbnailUrl: string;
  caption: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface PostStatus {
  status: UploadStatus;
  error?: string;
}

export default function InstagramImportPage() {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [paginationToken, setPaginationToken] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Record<string, PostStatus>>({});
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const doFetch = useCallback(async (name: string, token: string | null, reset: boolean) => {
    setFetching(true);
    setFetchError(null);
    if (reset) {
      setPosts([]);
      setSelected(new Set());
      setStatuses({});
      setUploadDone(false);
      setPaginationToken(null);
    }

    try {
      let url = `/api/scrape-instagram?username=${encodeURIComponent(name)}`;
      if (token) url += `&pagination_token=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setPosts((prev) => reset ? (data.posts ?? []) : [...prev, ...(data.posts ?? [])]);
      setPaginationToken(data.paginationToken ?? null);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to fetch posts");
    } finally {
      setFetching(false);
    }
  }, []);

  const handleFetch = useCallback(() => {
    const name = username.trim();
    if (!name) return;
    doFetch(name, null, true);
  }, [username, doFetch]);

  const handleLoadMore = useCallback(() => {
    const name = username.trim();
    if (!name || !paginationToken) return;
    doFetch(name, paginationToken, false);
  }, [username, paginationToken, doFetch]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(posts.map((p) => p.id)));
  }, [posts]);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleUpload = useCallback(async () => {
    const toUpload = posts.filter((p) => selected.has(p.id));
    if (!toUpload.length) return;

    setUploading(true);
    setUploadDone(false);

    // Optimistically mark all selected posts as uploading
    setStatuses((prev) => {
      const next = { ...prev };
      for (const p of toUpload) next[p.id] = { status: "uploading" };
      return next;
    });

    try {
      const res = await fetch("/api/upload-to-sanity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: toUpload }),
      });

      if (!res.ok || !res.body) {
        // Non-streaming error (e.g. 400 validation failure)
        const data: unknown = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? `HTTP ${res.status}`
        );
      }

      // Consume the NDJSON stream and update per-image status as events arrive
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event = JSON.parse(trimmed) as {
              id: string;
              status: UploadStatus;
              error?: string;
            };
            // Skip the "uploading" heartbeat — we already set it above
            if (event.status !== "uploading") {
              setStatuses((prev) => ({
                ...prev,
                [event.id]: { status: event.status, error: event.error },
              }));
            }
          } catch (parseErr) {
            console.error("Malformed NDJSON line from upload stream:", trimmed, parseErr);
          }
        }
      }
    } catch (e) {
      // Mark any posts still showing "uploading" as failed
      setStatuses((prev) => {
        const next = { ...prev };
        for (const p of toUpload) {
          if (next[p.id]?.status === "uploading") {
            next[p.id] = {
              status: "error",
              error: e instanceof Error ? e.message : "Upload failed",
            };
          }
        }
        return next;
      });
    }

    setUploading(false);
    setUploadDone(true);
  }, [posts, selected]);

  const selectedCount = selected.size;
  const allSelected = posts.length > 0 && selected.size === posts.length;
  const uploadedCount = Object.values(statuses).filter((s) => s.status === "success").length;
  const errorCount = Object.values(statuses).filter((s) => s.status === "error").length;
  const uploadingCount = Object.values(statuses).filter((s) => s.status === "uploading").length;
  const progressTotal = uploadedCount + errorCount + uploadingCount;
  const progressPercent = selectedCount > 0 ? Math.round(((uploadedCount + errorCount) / selectedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-5 py-5 flex items-center gap-3">
          <Instagram width={22} height={22} className="text-accent flex-shrink-0" aria-hidden="true" />
          <div>
            <h1 className="font-sans font-semibold text-h3 text-text-primary leading-tight">
              Instagram Import
            </h1>
            <p className="font-sans text-small text-text-muted mt-0.5">
              Fetch posts via RapidAPI and upload selected images to Sanity as draft products.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 py-8 space-y-8">
        {/* Username input */}
        <section aria-label="Fetch posts">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <label htmlFor="ig-username" className="sr-only">Instagram username</label>
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                aria-hidden="true"
              >
                @
              </span>
              <input
                id="ig-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !fetching && handleFetch()}
                placeholder="instagram_username"
                autoComplete="off"
                spellCheck={false}
                className="w-full h-[52px] pl-9 pr-4 bg-surface border border-border rounded-input font-sans text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <button
              onClick={handleFetch}
              disabled={fetching || !username.trim()}
              className="btn-primary flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {fetching && !paginationToken ? (
                <span className="inline-flex items-center gap-2">
                  <WarningCircle width={16} height={16} aria-hidden="true" className="animate-pulse" />
                  Fetching…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Search width={16} height={16} aria-hidden="true" />
                  Fetch Posts
                </span>
              )}
            </button>
          </div>

          {fetchError && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2.5 px-4 py-3 rounded-input bg-surface border border-[#B05A4A]/30 text-[#B05A4A]"
            >
              <XmarkCircle width={16} height={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-sans text-small leading-snug">{fetchError}</span>
            </div>
          )}
        </section>

        {/* Empty state */}
        {!fetching && posts.length === 0 && !fetchError && (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
            <MediaImageList width={40} height={40} aria-hidden="true" />
            <p className="font-sans text-small">Enter a username above to fetch posts.</p>
          </div>
        )}

        {/* Thumbnail grid */}
        {posts.length > 0 && (
          <section aria-label="Instagram posts">
            {/* Grid header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Selected count badge */}
                {selectedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-sans text-small font-semibold">
                    <CheckCircle width={14} height={14} aria-hidden="true" />
                    {selectedCount} selected
                  </span>
                )}

                {/* Select All */}
                <button
                  onClick={selectAll}
                  disabled={allSelected || uploading}
                  className="inline-flex items-center gap-1.5 font-sans text-small font-medium text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Select all posts"
                >
                  <SelectWindow width={15} height={15} aria-hidden="true" />
                  Select All
                </button>

                {/* Deselect All */}
                <button
                  onClick={deselectAll}
                  disabled={selectedCount === 0 || uploading}
                  className="inline-flex items-center gap-1.5 font-sans text-small font-medium text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Deselect all posts"
                >
                  <Xmark width={15} height={15} aria-hidden="true" />
                  Deselect All
                </button>

                <span className="font-sans text-small text-text-muted">
                  {posts.length} post{posts.length !== 1 ? "s" : ""}
                </span>
              </div>

              {uploadDone && (
                <p className="font-sans text-small text-text-secondary">
                  <span className="text-[#25855A] font-medium">{uploadedCount} uploaded</span>
                  {errorCount > 0 && (
                    <span className="text-[#B05A4A] font-medium"> · {errorCount} failed</span>
                  )}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {posts.map((post) => {
                const isSelected = selected.has(post.id);
                const status = statuses[post.id];

                return (
                  <div
                    key={post.id}
                    onClick={() => !uploading && toggleSelect(post.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    aria-label={post.caption ? `Post: ${post.caption.slice(0, 60)}` : `Post ${post.id}`}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !uploading && toggleSelect(post.id)}
                    className={`relative aspect-square rounded-card overflow-hidden cursor-pointer select-none transition-all duration-150 ring-2 ${
                      isSelected ? "ring-primary" : "ring-transparent"
                    } ${uploading ? "cursor-default" : "hover:ring-primary/50"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.thumbnailUrl}
                      alt={post.caption ? post.caption.slice(0, 80) : `Instagram post ${post.id}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Checkbox overlay */}
                    <div
                      className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white/70 border-white/90 backdrop-blur-sm"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 10 8"
                          fill="none"
                          className="w-2.5 h-2 text-white"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 4l2.5 2.5L9 1" />
                        </svg>
                      )}
                    </div>

                    {/* Upload status overlay */}
                    {status && (
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center gap-1 ${
                          status.status === "uploading"
                            ? "bg-primary/60 backdrop-blur-[2px]"
                            : status.status === "success"
                            ? "bg-[#25855A]/70 backdrop-blur-[2px]"
                            : "bg-[#B05A4A]/70 backdrop-blur-[2px]"
                        }`}
                      >
                        {status.status === "uploading" && (
                          <>
                            <WarningCircle
                              width={20}
                              height={20}
                              className="text-white animate-pulse"
                              aria-hidden="true"
                            />
                            <span className="font-sans text-micro text-white font-medium">Uploading…</span>
                          </>
                        )}
                        {status.status === "success" && (
                          <>
                            <CheckCircle width={20} height={20} className="text-white" aria-hidden="true" />
                            <span className="font-sans text-micro text-white font-medium">Uploaded</span>
                          </>
                        )}
                        {status.status === "error" && (
                          <>
                            <XmarkCircle width={20} height={20} className="text-white" aria-hidden="true" />
                            <span
                              className="font-sans text-micro text-white font-medium text-center px-2 leading-tight"
                              title={status.error}
                            >
                              Failed
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Caption tooltip on hover */}
                    {post.caption && !status && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="font-sans text-micro text-white line-clamp-2 leading-snug">
                          {post.caption}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Load More button */}
            {paginationToken && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={fetching || uploading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {fetching ? (
                    <span className="inline-flex items-center gap-2">
                      <WarningCircle width={16} height={16} aria-hidden="true" className="animate-pulse" />
                      Loading…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <MediaImageList width={16} height={16} aria-hidden="true" />
                      Load More
                    </span>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Upload bar */}
        {selectedCount > 0 && (
          <div className="sticky bottom-0 -mx-5 px-5 py-4 bg-surface/95 backdrop-blur border-t border-border space-y-3">
            {/* Progress bar — only shown while uploading or after done */}
            {(uploading || uploadDone) && progressTotal > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-small text-text-secondary">
                    {uploading ? `Uploading ${uploadedCount + errorCount} / ${selectedCount}…` : `${uploadedCount} uploaded${errorCount > 0 ? ` · ${errorCount} failed` : ""}`}
                  </span>
                  <span className="font-sans text-small text-text-muted">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: errorCount > 0 && !uploading ? "#B05A4A" : "#25855A",
                    }}
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <p className="font-sans text-small text-text-secondary">
                {selectedCount} post{selectedCount !== 1 ? "s" : ""} selected
              </p>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {uploading ? (
                  <span className="inline-flex items-center gap-2">
                    <WarningCircle width={16} height={16} aria-hidden="true" className="animate-pulse" />
                    Uploading {uploadedCount + errorCount}/{selectedCount}…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <CloudUpload width={16} height={16} aria-hidden="true" />
                    Upload Selected to Sanity
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
