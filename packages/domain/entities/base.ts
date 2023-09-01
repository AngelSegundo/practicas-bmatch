import zod from "zod";

// create zod schema
export const BaseEntitySchema = zod.object({
  id: zod.string(),
  createdAt: zod.string(),
  updatedAt: zod.string(),
});

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
