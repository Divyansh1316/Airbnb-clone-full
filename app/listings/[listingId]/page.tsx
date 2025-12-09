import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingsById";
import getReservations from "@/app/actions/getReservation";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";

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
  const listing = await getListingById({ listingId });
  const reservations = await getReservations({ listingId });
  const currentUser = await getCurrentUser();

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
      />
    </ClientOnly>
  );
};

export default ListingPage;
