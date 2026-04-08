import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/sanity";

export const runtime = "nodejs";

// GET /api/admin/products — returns all products ordered by creation date desc
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}
