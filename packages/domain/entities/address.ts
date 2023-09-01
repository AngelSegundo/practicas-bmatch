import zod from "zod";

export interface Address {
  streetName: string;
  location: string;
  postalCode: string;
  countryId: string;
  province: string;
  city: string;
}

export const AddressSchema = zod.object({
  streetName: zod.string(),
  location: zod.string(),
  postalCode: zod.string(),
  countryId: zod.string(),
  province: zod.string(),
  city: zod.string(),
});
