import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/sanity";

export const runtime = "nodejs";

// DELETE /api/admin/product?id=<documentId>
export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    await serverClient.delete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/product — body: { id, name }
export async function PATCH(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { id, name } = body as { id?: string; name?: string };
  if (!id || !name || typeof id !== "string" || typeof name !== "string") {
    return NextResponse.json({ error: "id and name are required" }, { status: 400 });
  }
  try {
    await serverClient.patch(id).set({ name: name.trim() }).commit();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 500 }
    );
  }
}
