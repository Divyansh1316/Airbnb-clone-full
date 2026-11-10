import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingsById";
import getListingReservations from "@/app/actions/getListingReservations";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getRecommendedListings from "@/app/actions/getRecommendedListings";
import getListingReviews from "@/app/actions/getListingReviews";
import { getWishlistsForCurrentUser } from "@/app/actions/getWishlists";

interface IParams {
  listingId?: string;
}

// ✅ In Next 15, params is async for dynamic routes
interface ListingPageProps {
  params: Promise<IParams>;
}

const ListingPage = async ({ params }: ListingPageProps) => {
  // ✅ Await params ONCE here
  const { listingId } = await params;

  // Pass a plain object to your actions
  const [listing, reservations, currentUser, recommendedListings, reviewData, wishlists] = await Promise.all([
    getListingById({ listingId }),
    listingId ? getListingReservations(listingId) : Promise.resolve([]),
    getCurrentUser(),
    listingId ? getRecommendedListings(listingId) : Promise.resolve([]),
    listingId ? getListingReviews(listingId) : Promise.resolve({ reviews: [], canReview: false }),
    getWishlistsForCurrentUser(),
  ]);

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        reservations={reservations}
        currentUser={currentUser}
        recommendedListings={recommendedListings}
        reviews={reviewData.reviews}
        canReview={reviewData.canReview}
        wishlists={wishlists.map(({ id, name }) => ({ id, name }))}
      />
    </ClientOnly>
  );
};

export default ListingPage;
