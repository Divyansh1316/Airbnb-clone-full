"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import { SafeListing, SafeUser } from "@/app/types";

export default function WishlistDetailClient({
  wishlist,
  listings,
  currentUser,
}: {
  wishlist: { id: string; name: string };
  listings: SafeListing[];
  currentUser: SafeUser;
}) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState("");
  const removeListing = useCallback(async (id: string) => {
    setRemovingId(id);
    try {
      await axios.patch(`/api/wishlists/${wishlist.id}`, { listingId: id, action: "remove" });
      toast.success("Removed from collection");
      router.refresh();
    } catch {
      toast.error("Could not remove this stay.");
    } finally {
      setRemovingId("");
    }
  }, [router, wishlist.id]);

  return (
    <Container>
      <Heading title={wishlist.name} subtitle={`${listings.length} saved ${listings.length === 1 ? "stay" : "stays"}`} />
      {listings.length ? (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} data={listing} currentUser={currentUser} onAction={removeListing} actionId={listing.id} actionLabel={removingId === listing.id ? "Removing…" : "Remove from collection"} disabled={removingId === listing.id} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-neutral-500">This collection is empty. Save a stay from its listing page.</p>
      )}
    </Container>
  );
}
