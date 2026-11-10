import getCurrentUser from "@/app/actions/getCurrentUser";
import { getWishlists } from "@/app/actions/getWishlists";
import EmptyState from "@/app/components/EmptyState";
import WishlistsClient from "@/app/components/wishlists/WishlistsClient";

export default async function WishlistsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return <EmptyState title="Sign in to view wishlists" subtitle="Save favorite stays into collections." />;
  const wishlists = await getWishlists(currentUser.id);
  return <WishlistsClient wishlists={wishlists} />;
}
