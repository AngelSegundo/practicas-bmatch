import { BaseEntity } from "./base";

export const TIP_TABLE_NAME = "tips";
export const TIP_ID_PREFIX = "tip";

export interface Tip {
  text: string;
  order: number;
  image?: string;
  
}

export interface TipDTO extends BaseEntity, Tip {}
