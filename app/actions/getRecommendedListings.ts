import prisma from "@/app/libs/prismadb";
import { SafeListing } from "@/app/types";

export default async function getRecommendedListings(listingId: string) {
  const current = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { category: true, locationValue: true },
  });
  if (!current) return [] as SafeListing[];

  const listings = await prisma.listing.findMany({
    where: {
      id: { not: listingId },
      OR: [
        { category: current.category },
        { locationValue: current.locationValue },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 16,
  });

  return listings
    .sort((a, b) => {
      const score = (listing: (typeof listings)[number]) =>
        Number(listing.category === current.category) +
        Number(listing.locationValue === current.locationValue);
      return score(b) - score(a);
    })
    .slice(0, 4)
    .map((listing) => ({ ...listing, createdAt: listing.createdAt.toISOString() }));
}
