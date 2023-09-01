import zod from "zod";
import { BaseEntity, BaseEntitySchema } from "./base";
import { ServiceType } from "./service";

export const SERVICE_CONNECTION_ID_PREFIX = "con";
export const SERVICE_CONNECTION_TABLE_NAME = "connections";

export enum ServiceConnectionStatus {
  active = "active",
  cancel = "cancel",
  pending = "pending",
}
export interface ServiceConnection {
  serviceId: string;
  userId: string;
  config: { [key: string]: string | number };
  status: ServiceConnectionStatus;
  alias: string;
  type: ServiceType;
  serviceKey?: string;
}

export interface ServiceConnectionDTO extends ServiceConnection, BaseEntity {}

export const ServiceConnectionSchema = zod.object({
  serviceId: zod.string(),
  userId: zod.string(),
  // config: zod.record(zod.string()),
  status: zod.nativeEnum(ServiceConnectionStatus),
  alias: zod.string().optional(),
  type: zod.nativeEnum(ServiceType),
  serviceKey: zod.string().optional(),
});

export const ServiceConnectionDTOSchema =
  ServiceConnectionSchema.merge(BaseEntitySchema);
