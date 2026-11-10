import getCurrentUser from "@/app/actions/getCurrentUser";
import { getWishlistById } from "@/app/actions/getWishlists";
import EmptyState from "@/app/components/EmptyState";
import WishlistDetailClient from "@/app/components/wishlists/WishlistDetailClient";

type PageProps = { params: Promise<{ wishlistId: string }> };

export default async function WishlistDetailPage({ params }: PageProps) {
  const [{ wishlistId }, currentUser] = await Promise.all([params, getCurrentUser()]);
  if (!currentUser) return <EmptyState title="Sign in to view wishlists" subtitle="Save favorite stays into collections." />;
  const wishlist = await getWishlistById(wishlistId, currentUser.id);
  if (!wishlist) return <EmptyState title="Collection not found" />;
  return <WishlistDetailClient wishlist={{ id: wishlist.id, name: wishlist.name }} listings={wishlist.listings} currentUser={currentUser} />;
}
