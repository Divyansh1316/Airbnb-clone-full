import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

type RouteContext = { params: Promise<{ wishlistId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const { wishlistId } = await params;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const data = body as Record<string, unknown>;

  const wishlist = await prisma.wishlistCollection.findFirst({ where: { id: wishlistId, userId: currentUser.id } });
  if (!wishlist) return NextResponse.json({ error: "Collection not found." }, { status: 404 });

  if (typeof data.name === "string") {
    const name = data.name.trim();
    if (!name || name.length > 50) return NextResponse.json({ error: "Collection names must be 1–50 characters." }, { status: 400 });
    const updated = await prisma.wishlistCollection.update({
      where: { id: wishlist.id },
      data: { name },
      select: { id: true, name: true },
    });
    return NextResponse.json(updated);
  }

  const listingId = data.listingId;
  const action = data.action;
  if (typeof listingId !== "string" || !/^[a-f\d]{24}$/i.test(listingId) || !["add", "remove"].includes(String(action))) {
    return NextResponse.json({ error: "Invalid collection update." }, { status: 400 });
  }
  if (action === "add") {
    const listingExists = await prisma.listing.findUnique({ where: { id: listingId }, select: { id: true } });
    if (!listingExists) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  const listingIds = action === "add"
    ? wishlist.listingIds.includes(listingId) ? wishlist.listingIds : [...wishlist.listingIds, listingId]
    : wishlist.listingIds.filter((id) => id !== listingId);
  const updated = await prisma.wishlistCollection.update({
    where: { id: wishlist.id },
    data: { listingIds },
    select: { id: true, name: true, listingIds: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const { wishlistId } = await params;
  const result = await prisma.wishlistCollection.deleteMany({ where: { id: wishlistId, userId: currentUser.id } });
  if (!result.count) return NextResponse.json({ error: "Collection not found." }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
