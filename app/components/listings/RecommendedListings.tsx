"use client";

import { SafeListing, SafeUser } from "@/app/types";
import ListingCard from "./ListingCard";

export default function RecommendedListings({
  listings,
  currentUser,
}: {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}) {
  if (listings.length === 0) return null;

  return (
    <section className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <h2 className="text-2xl font-semibold">Similar stays</h2>
      <p className="mt-1 text-neutral-500 dark:text-neutral-400">
        More places in this category and location.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} data={listing} currentUser={currentUser} />
        ))}
      </div>
    </section>
  );
}
