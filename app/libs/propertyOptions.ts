export const propertyTypes = ["Entire place", "Private room", "Shared room"] as const;

export const amenityOptions = [
  "Wi-Fi",
  "Kitchen",
  "Washer",
  "Air conditioning",
  "Pool",
  "Free parking",
  "Pet-friendly",
] as const;

export type PropertyType = (typeof propertyTypes)[number];
export type Amenity = (typeof amenityOptions)[number];
