import { BaseEntitySchema, BaseEntity } from "./base";
import { ServiceType } from "./service";
import zod from "zod";

export const SERVICE_READING_ID_PREFIX = "read";
export const SERVICE_READING_TABLE_NAME = "readings";

// create zod schema
export const ServiceReadingSchema = zod.object({
  serviceId: zod.string(),
  serviceConnectionId: zod.string(),
  userId: zod.string(),
  scrapperInstance: zod.string().optional(),
  value: zod.number(),
  unit: zod.string(),
  readingDate: zod.string(),
  month: zod.string().optional(),
  year: zod.string().optional(),
  type: zod.nativeEnum(ServiceType),
  bucketURL: zod.string().optional(),
  pdf: zod.custom<File>().optional(),
});

// create DTO
export const ServiceReadingDTOSchema =
  ServiceReadingSchema.merge(BaseEntitySchema);

export interface ServiceReading {
  serviceId: string;
  serviceConnectionId: string;
  userId: string;
  scrapperInstance?: string;
  value: number;
  unit: string;
  readingDate: string;
  month?: string;
  year?: string;
  type: ServiceType;
  bucketURL?: string;
  pdf?: File;
}

export interface ServiceReadingDTO extends ServiceReading, BaseEntity {}