import zod from "zod";
import { Address, AddressSchema } from "./address";
import { BaseEntity, BaseEntitySchema } from "./base";

export const SPONSOR_TABLE_NAME = "sponsors";
export const SPONSOR_ID_PREFIX = "spo";

export interface Sponsor {
  legalName: string;
  commercialName: string;
  taxId: string;
  countryId: string;
  billingAddress: Address;
  manager: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface SponsorDTO extends BaseEntity, Sponsor {}

export const SponsorSchema = zod.object({
  legalName: zod.string(),
  commercialName: zod.string(),
  taxId: zod.string(),
  countryId: zod.string(),
  manager: zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    email: zod.string(),
    phone: zod.string().optional(),
  }),
  billingAddress: AddressSchema,
});

export const SponsorDTOSchema = SponsorSchema.merge(BaseEntitySchema);
