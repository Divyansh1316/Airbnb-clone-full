import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

type RouteContext = { params: Promise<{ listingId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Please sign in to review a stay." }, { status: 401 });

  const { listingId } = await params;
  if (!/^[a-f\d]{24}$/i.test(listingId)) {
    return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  }

  const { rating, comment } = body as Record<string, unknown>;
  if (!Number.isInteger(rating) || Number(rating) < 1 || Number(rating) > 5 ||
      typeof comment !== "string" || comment.trim().length < 5 || comment.trim().length > 1000) {
    return NextResponse.json({ error: "Choose 1–5 stars and write a review of 5–1000 characters." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { id: true, userId: true } });
  if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  if (listing.userId === currentUser.id) {
    return NextResponse.json({ error: "You cannot review your own listing." }, { status: 403 });
  }

  const completedStay = await prisma.reservation.findFirst({
    where: { listingId, userId: currentUser.id, endDate: { lte: new Date() } },
    select: { id: true },
  });
  if (!completedStay) {
    return NextResponse.json({ error: "Reviews are available after a completed stay." }, { status: 403 });
  }

  const review = await prisma.review.upsert({
    where: { userId_listingId: { userId: currentUser.id, listingId } },
    create: { userId: currentUser.id, listingId, rating: Number(rating), comment: comment.trim() },
    update: { rating: Number(rating), comment: comment.trim() },
    select: { id: true, rating: true, comment: true, createdAt: true },
  });

  return NextResponse.json({ ...review, createdAt: review.createdAt.toISOString() });
}
