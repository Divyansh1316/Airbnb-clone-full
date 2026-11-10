import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { amenityOptions, propertyTypes } from "@/app/libs/propertyOptions";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid listing details." }, { status: 400 });
  }

  const { title, description, imageSrc, category, roomCount, bathroomCount, guestCount, location, price, amenities } = body;
  const propertyType = propertyTypes.find((type) => type === body.propertyType) ?? "Entire place";
  const selectedAmenities = Array.isArray(amenities)
    ? [...new Set(amenities.filter((item): item is string => typeof item === "string"))]
    : [];
  const validAmenities = amenities === undefined || Array.isArray(amenities);
  const validCount = (value: unknown) => Number.isSafeInteger(value) && (value as number) >= 1 && (value as number) <= 100;
  const parsedImage = typeof imageSrc === "string" ? (() => { try { return new URL(imageSrc); } catch { return null; } })() : null;
  const validImage = parsedImage?.protocol === "https:" && parsedImage.hostname === "res.cloudinary.com";
  const validLocation = location && typeof location === "object" && typeof location.value === "string" && /^[A-Z]{2}$/.test(location.value);
  const validCategory = ["Beach", "Windmill", "Modern", "Countryside", "Pools", "Islands", "Lake", "Skiing", "Castles", "Caves", "Camping", "Arctic", "Desert", "Barns", "Lux"].includes(category);

  if (
    typeof title !== "string" || title.trim().length < 3 || title.trim().length > 100 ||
    typeof description !== "string" || description.trim().length < 10 || description.trim().length > 5000 ||
    !validImage || !validCategory ||
    !validAmenities || selectedAmenities.some((amenity) => !amenityOptions.includes(amenity as (typeof amenityOptions)[number])) ||
    !validCount(roomCount) || !validCount(bathroomCount) || !validCount(guestCount) ||
    !validLocation || !Number.isSafeInteger(Number(price)) || Number(price) < 1 || Number(price) > 100_000
  ) {
    return NextResponse.json({ error: "Listing details are invalid." }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      imageSrc: parsedImage!.toString(),
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      propertyType,
      amenities: { create: selectedAmenities.map((name) => ({ name })) },
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
