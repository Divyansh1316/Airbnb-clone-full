import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const name = body && typeof body === "object" ? (body as Record<string, unknown>).name : null;
  const listingId = body && typeof body === "object" ? (body as Record<string, unknown>).listingId : undefined;
  if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 50) {
    return NextResponse.json({ error: "Collection names must be 1–50 characters." }, { status: 400 });
  }

  if (listingId !== undefined && (typeof listingId !== "string" || !/^[a-f\d]{24}$/i.test(listingId))) {
    return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  }
  if (typeof listingId === "string") {
    const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { id: true } });
    if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const wishlist = await prisma.wishlistCollection.create({
    data: { userId: currentUser.id, name: name.trim(), listingIds: typeof listingId === "string" ? [listingId] : [] },
    select: { id: true, name: true, listingIds: true },
  });
  return NextResponse.json(wishlist, { status: 201 });
}
