import { createClient, type QueryParams } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type ProductCategory = "denim" | "dresses" | "tops" | "sets" | "sale" | "kids";

export interface SanityProduct {
  _id: string;
  _createdAt: string;
  name: string;
  slug: string;
  sku?: string;
  price: string;
  originalPrice?: string;
  size: string;
  category: ProductCategory;
  image: SanityImageSource;
  imageUrl: string;
  tryOnGarmentUrl?: string;
  isSoldOut: boolean;
  isNew: boolean;
  isKids: boolean;
  listedDate?: string;
  description?: string;
}

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-03-01";

if (!projectId) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID. " +
    "Add it to your .env.local file (for local dev) or to the Vercel project's Environment Variables dashboard."
  );
}

export const serverClient = createClient({
  projectId, dataset, apiVersion, useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
export const browserClient = createClient({ projectId, dataset, apiVersion, useCdn: true });

const builder = imageUrlBuilder(serverClient);

export function productImageUrl(source: SanityImageSource, width = 600): string {
  return builder.image(source)
    .width(width).height(Math.round(width * (4 / 3)))
    .auto("format").quality(82).fit("crop").crop("center").url();
}
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").quality(80);
}

const FIELDS = `_id,_createdAt,name,"slug":slug.current,sku,price,originalPrice,size,category,image,tryOnGarmentUrl,isSoldOut,isNew,isKids,listedDate,description`;
type Raw = Omit<SanityProduct, "imageUrl">;
function hydrate(raws: Raw[]): SanityProduct[] {
  return raws.map((p) => ({ ...p, imageUrl: p.image ? productImageUrl(p.image) : "" }));
}

export async function getAllProducts() {
  return hydrate(await serverClient.fetch<Raw[]>(`*[_type=="product"]|order(_createdAt desc){${FIELDS}}`));
}
export async function getFeaturedProducts(limit = 6) {
  return hydrate(await serverClient.fetch<Raw[]>(
    `*[_type=="product"&&isSoldOut!=true&&isKids!=true]|order(isNew desc,_createdAt desc)[0...${limit}]{${FIELDS}}`
  ));
}
export async function getProductsByCategory(category: ProductCategory) {
  return hydrate(await serverClient.fetch<Raw[]>(
    `*[_type=="product"&&category==$category]|order(isSoldOut asc,_createdAt desc){${FIELDS}}`, { category }
  ));
}
export async function getKidsProducts() {
  return hydrate(await serverClient.fetch<Raw[]>(
    `*[_type=="product"&&isKids==true]|order(isSoldOut asc,_createdAt desc){${FIELDS}}`
  ));
}
export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  const raw = await serverClient.fetch<Raw | null>(
    `*[_type=="product"&&slug.current==$slug][0]{${FIELDS}}`, { slug }
  );
  if (!raw) return null;
  return hydrate([raw])[0];
}
export async function getSaleProducts() {
  return hydrate(await serverClient.fetch<Raw[]>(
    `*[_type=="product"&&(category=="sale"||defined(originalPrice))]|order(_createdAt desc){${FIELDS}}`
  ));
}
export async function searchProducts(q: string) {
  if (!q.trim()) return [];
  return hydrate(await serverClient.fetch<Raw[]>(
    `*[_type=="product"&&name match $q]|order(isSoldOut asc,_createdAt desc)[0...20]{${FIELDS}}`,
    { q: `${q.toLowerCase()}*` }
  ));
}
export interface SiteSettings {
  heroImage: SanityImageSource | null;
  heroImageAlt: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await serverClient.fetch<{ heroImage?: SanityImageSource; heroImageAlt?: string } | null>(
    `*[_type=="siteSettings"][0]{heroImage,heroImageAlt}`
  );
  return {
    heroImage: raw?.heroImage ?? null,
    heroImageAlt: raw?.heroImageAlt ?? "Model wearing a Zira Fashions outfit",
  };
}

export function heroImageUrl(source: SanityImageSource, width = 1200): string {
  return builder.image(source)
    .width(width)
    .auto("format")
    .quality(85)
    .fit("max")
    .url();
}

export async function sanityFetch<T>(query: string, params: QueryParams = {}) {
  return serverClient.fetch<T>(query, params);
}
