import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function getWishlists(userId: string) {
  const wishlists = await prisma.wishlistCollection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, listingIds: true, updatedAt: true },
  });
  return wishlists.map((wishlist) => ({ ...wishlist, updatedAt: wishlist.updatedAt.toISOString() }));
}

export async function getWishlistById(id: string, userId: string) {
  const wishlist = await prisma.wishlistCollection.findFirst({
    where: { id, userId },
    select: { id: true, name: true, listingIds: true },
  });
  if (!wishlist) return null;

  const listings = wishlist.listingIds.length
    ? await prisma.listing.findMany({ where: { id: { in: wishlist.listingIds } } })
    : [];
  const byId = new Map(listings.map((listing) => [listing.id, listing]));
  return {
    ...wishlist,
    listings: wishlist.listingIds.flatMap((listingId) => {
      const listing = byId.get(listingId);
      return listing ? [{ ...listing, createdAt: listing.createdAt.toISOString() }] : [];
    }),
  };
}

export async function getWishlistsForCurrentUser() {
  const currentUser = await getCurrentUser();
  return currentUser ? getWishlists(currentUser.id) : [];
}
