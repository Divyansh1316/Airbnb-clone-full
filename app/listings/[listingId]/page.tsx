import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingsById";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import ClientOnly from "@/app/components/ClientOnly";
import getReservations from "@/app/actions/getReservation";

interface IParams {
  listingId?: string;
}

//  params is async in Next 15
interface ListingPageProps {
  params: Promise<IParams>;
}

const ListingPage = async ({ params }: ListingPageProps) => {
  //  Await params once
  const resolvedParams = await params;

  const listing = await getListingById(resolvedParams);
  const reservations = await getReservations(resolvedParams);
  const currentUser = await getCurrentUser();

  if (!listing) {
    //  actually return the JSX
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
