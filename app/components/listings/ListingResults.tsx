"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SafeListing, SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import ListingCard from "./ListingCard";
import Container from "../Container";
import { MapMarker } from "../Map";

const LeafletMapView = dynamic(() => import("../Map"), { ssr: false });

export default function ListingResults({
  listings,
  currentUser,
}: {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}) {
  const [view, setView] = useState<"list" | "map">("list");
  const { getByValue } = useCountries();

  const markers = useMemo(() => {
    const groups = new Map<string, MapMarker>();
    for (const listing of listings) {
      const country = getByValue(listing.locationValue);
      if (!country) continue;
      const marker = groups.get(listing.locationValue) ?? {
        id: listing.locationValue,
        position: country.latlng,
        listings: [],
      };
      marker.listings.push({ id: listing.id, title: listing.title, price: listing.price });
      groups.set(listing.locationValue, marker);
    }
    return [...groups.values()];
  }, [getByValue, listings]);

  return (
    <Container>
      <div className="mb-5 flex justify-end gap-2" aria-label="Property view">
        <button
          type="button"
          onClick={() => setView("list")}
          aria-pressed={view === "list"}
          className={`rounded-full border px-4 py-2 text-sm ${view === "list" ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black" : "border-neutral-300"}`}
        >List</button>
        <button
          type="button"
          onClick={() => setView("map")}
          aria-pressed={view === "map"}
          className={`rounded-full border px-4 py-2 text-sm ${view === "map" ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black" : "border-neutral-300"}`}
        >Map</button>
      </div>
      {view === "map" ? (
        <LeafletMapView markers={markers} />
      ) : (
        <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {listings.map((listing, index) => (
            <ListingCard currentUser={currentUser} key={listing.id} data={listing} isAboveFold={index < 2} />
          ))}
        </div>
      )}
    </Container>
  );
}
