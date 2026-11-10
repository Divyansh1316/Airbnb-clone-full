import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { listingId, startDate, endDate } = body ?? {};
  if (typeof listingId !== "string" || !/^[a-f\d]{24}$/i.test(listingId)) {
    return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "Choose a valid date range." }, { status: 400 });
  }
  const nights = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
  if (nights < 1 || nights > 365) {
    return NextResponse.json({ error: "Reservations must be between 1 and 365 nights." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, userId: true, price: true },
  });
  if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  if (listing.userId === currentUser.id) {
    return NextResponse.json({ error: "You cannot reserve your own listing." }, { status: 400 });
  }

  const overlappingReservation = await prisma.reservation.findFirst({
    where: {
      listingId,
      startDate: { lt: end },
      endDate: { gt: start },
    },
    select: { id: true },
  });
  if (overlappingReservation) {
    return NextResponse.json({ error: "Those dates are no longer available." }, { status: 409 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      listingId,
      userId: currentUser.id,
      startDate: start,
      endDate: end,
      totalPrice: listing.price * nights,
    },
  });

  return NextResponse.json(reservation, { status: 201 });
}
