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
  if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 50) {
    return NextResponse.json({ error: "Collection names must be 1–50 characters." }, { status: 400 });
  }

  const wishlist = await prisma.wishlistCollection.create({
    data: { userId: currentUser.id, name: name.trim(), listingIds: [] },
    select: { id: true, name: true, listingIds: true },
  });
  return NextResponse.json(wishlist, { status: 201 });
}
