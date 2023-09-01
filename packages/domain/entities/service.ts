import zod from "zod";
import { BaseEntity, BaseEntitySchema } from "./base";

export const SERVICE_ID_PREFIX = "ser";
export const SERVICE_TABLE_NAME = "services";
export enum ServiceType {
  water = "water",
  electricity = "electricity",
  gas = "gas",
  freeway = "freeway",
}
export enum ServiceStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending",
}
export interface ServiceInput {
  inputId: string;
  label: string;
  placeholder: string;
  type: string;
}

export interface Service {
  name: string;
  key?: string;
  logo?: string;
  type: ServiceType;
  status: ServiceStatus;
  config: ServiceInput[];
  countryId: string;
  addServiceMessage: string;
  helperImages: string[];
  tips: { value: string }[];
  tipsValue?: string[];
}

export interface ServiceDTO extends Service, BaseEntity {}

export const ServiceSchema = zod.object({
  name: zod.string(),
  key: zod.string().optional(),
  logo: zod.string().optional(),
  type: zod.nativeEnum(ServiceType),
  status: zod.nativeEnum(ServiceStatus),
  config: zod.array(
    zod.object({
      inputId: zod.string(),
      label: zod.string(),
      placeholder: zod.string(),
      type: zod.string(),
    })
  ),
  countryId: zod.string(),
  addServiceMessage: zod.string(),
  tips: zod
    .array(
      zod.object({
        value: zod.string(),
      })
    )
    .max(5),
});

export const ServiceDTOSchema = ServiceSchema.merge(BaseEntitySchema);
