"use client";

import useCountries from "@/app/hooks/useCountries";
import useSearchModal from "@/app/hooks/useSearchModal";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");
  const guestCount = params?.get("guestCount");

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }

    return "Anywhere";
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);

      if (diff == 0) {
        diff = 1;
      }

      return `${diff} Days`;
    }

    return "Any week";
  }, [startDate, endDate]);

  const guestLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} Guests`;
    }

    return "Add guests";
  }, [guestCount]);

  return (
    <div
      onClick={searchModal.onOpen}
      className="min-w-0 flex-1 cursor-pointer rounded-full border border-neutral-300 py-2 shadow-sm transition hover:shadow-md dark:border-[#747985] md:w-auto md:flex-none"
    >
      <div className="flex min-w-0 flex-row items-center">
        <div className="min-w-0 flex-1 truncate px-4 text-left text-sm font-semibold sm:flex-none sm:px-6 sm:text-center">
          {locationLabel}
        </div>
        <div className="hidden min-w-0 flex-1 border-x-[1px] border-neutral-300 px-6 text-center text-sm font-semibold dark:border-[#747985] sm:block">
          {durationLabel}
        </div>
        <div className="flex shrink-0 flex-row items-center gap-3 border-l-[1px] border-neutral-300 pl-3 pr-2 text-sm text-gray-600 dark:border-[#747985] dark:text-neutral-200 sm:border-l-0 sm:pl-6">
          <div className="hidden whitespace-nowrap sm:block">{guestLabel}</div>
          <div className="shrink-0 rounded-full bg-rose-500 p-2 text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
