export interface ProductOrderDetails {
  name: string;
  size: string;
  price: string;
  productUrl: string;
  sku?: string;
  isKids?: boolean;
}

export interface TryOnOrderDetails extends ProductOrderDetails {
  fromTryOn: true;
}

export type OrderDetails = ProductOrderDetails | TryOnOrderDetails;

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const BASE = "https://wa.me";

export function buildWhatsAppOrderUrl(product: OrderDetails, phone = PHONE): string {
  const isTryOn = "fromTryOn" in product && product.fromTryOn;
  const lines = [
    "Hi Zira Fashions! I'd like to place an order 🛍️",
    "",
    `Item:  ${product.name}`,
    `Size:  ${product.size}`,
    `Price: ${product.price}`,
    `Link:  ${product.productUrl}`,
    product.sku ? `Ref:   ${product.sku}` : null,
    isTryOn ? "" : null,
    isTryOn ? "P.S. I tried this on using the virtual try-on 😊" : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return `${BASE}/${phone}?text=${encodeURIComponent(lines)}`;
}

export function buildWhatsAppContactUrl(
  greeting = "Hi Zira Fashions! I have a question.",
  phone = PHONE
): string {
  return `${BASE}/${phone}?text=${encodeURIComponent(greeting)}`;
}

export function buildWhatsAppNotifyUrl(
  product: Pick<ProductOrderDetails, "name" | "size" | "sku" | "productUrl">,
  phone = PHONE
): string {
  const lines = [
    "Hi Zira Fashions! Please notify me when this is back in stock:",
    "",
    `Item: ${product.name}`,
    `Size: ${product.size}`,
    `Link: ${product.productUrl}`,
    product.sku ? `Ref:  ${product.sku}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return `${BASE}/${phone}?text=${encodeURIComponent(lines)}`;
}

export function isWhatsAppConfigured(): boolean {
  return /^\d{7,15}$/.test(PHONE);
}
