import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingParams } from "./actions/getListings";
import EmptyState from "./components/EmptyState";
import ListingResults from "./components/listings/ListingResults";

interface HomeProps {
  // ✅ In Next 15, searchParams is async
  searchParams: Promise<IListingParams>;
}

const Home = async ({ searchParams }: HomeProps) => {
  // ✅ Await it ONCE here
  const resolvedSearchParams = await searchParams;

  const [listings, currentUser] = await Promise.all([
    getListings({ ...resolvedSearchParams, limit: 24 }),
    getCurrentUser(),
  ]);

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <ListingResults listings={listings} currentUser={currentUser} />
  );
};

export default Home;
