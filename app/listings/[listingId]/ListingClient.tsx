"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";

import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Range } from "react-date-range";

import useLoginModal from "@/app/hooks/useLoginModal";
import RecommendedListings from "@/app/components/listings/RecommendedListings";
import ListingReviews from "@/app/components/listings/ListingReviews";
import CollectionSaver from "@/app/components/wishlists/CollectionSaver";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: Pick<SafeReservation, "startDate" | "endDate">[];
  listing: SafeListing & {
    user: SafeUser;
    amenities: { name: string }[];
  };
  currentUser?: SafeUser | null;
  recommendedListings: SafeListing[];
  reviews: { id: string; rating: number; comment: string; createdAt: string; user: { name: string | null; image: string | null } }[];
  canReview: boolean;
  wishlists: { id: string; name: string }[];
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
  recommendedListings,
  reviews,
  canReview,
  wishlists,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservations) => {
      const range = eachDayOfInterval({
        start: new Date(reservations.startDate),
        end: new Date(reservations.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const totalPrice = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return listing.price;
    const dateCount = differenceInCalendarDays(
      dateRange.endDate,
      dateRange.startDate
    );
    return dateCount && listing.price ? dateCount * listing.price : listing.price;
  }, [dateRange, listing.price]);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing.id,
      })
      .then(() => {
        toast.success("Listing reserved!");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing.id, router, currentUser, loginModal]);

  const category = useMemo(() => {
    return categories.find((item) => item.label == listing.category);
  }, [listing.category]);
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              amenities={listing.amenities}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
        <ListingReviews
          listingId={listing.id}
          reviews={reviews}
          canReview={canReview}
          currentUser={currentUser}
        />
        <div className="mt-6 max-w-md">
          <CollectionSaver listingId={listing.id} collections={wishlists} signedIn={Boolean(currentUser)} />
        </div>
        <RecommendedListings listings={recommendedListings} currentUser={currentUser} />
      </div>
    </Container>
  );
};
export default ListingClient;
