import prisma from "@/app/libs/prismadb";

export default async function getListingReservations(listingId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { listingId },
    select: { startDate: true, endDate: true },
  });

  return reservations.map((reservation) => ({
    startDate: reservation.startDate.toISOString(),
    endDate: reservation.endDate.toISOString(),
  }));
}
