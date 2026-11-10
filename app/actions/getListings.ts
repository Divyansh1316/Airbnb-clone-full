import prisma from "@/app/libs/prismadb";
import { amenityOptions, propertyTypes } from "@/app/libs/propertyOptions";

export interface IListingParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  limit?: number;
  minPrice?: string | number;
  maxPrice?: string | number;
  propertyType?: string;
  amenities?: string;
}

export default async function getListings(params: IListingParams) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      category,
      limit,
      minPrice,
      maxPrice,
      propertyType,
      amenities,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount, //gte means greater than equal to
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    const priceRange: { gte?: number; lte?: number } = {};
    const minimum = Number(minPrice);
    const maximum = Number(maxPrice);
    if (minPrice !== undefined && Number.isSafeInteger(minimum) && minimum >= 0) priceRange.gte = minimum;
    if (maxPrice !== undefined && Number.isSafeInteger(maximum) && maximum >= 0) priceRange.lte = maximum;
    if (Object.keys(priceRange).length) query.price = priceRange;

    if (propertyType && propertyTypes.includes(propertyType as (typeof propertyTypes)[number])) {
      query.propertyType = propertyType;
    }

    const selectedAmenities = amenities
      ? amenities.split(",").filter((name) => amenityOptions.includes(name as (typeof amenityOptions)[number]))
      : [];
    if (selectedAmenities.length) query.amenities = { some: { name: { in: selectedAmenities } } };

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      ...(limit ? { take: limit } : {}),
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
