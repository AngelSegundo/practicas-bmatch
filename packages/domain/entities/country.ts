import { BaseEntity } from "./base";

export const COUNTRY_TABLE_NAME = "countries";

export interface Country {
  name: string;
  flagCode: string;
  taxIdLabel: string;
  taxIdRegex: string;
  code: string;
}

export interface CountryDTO extends BaseEntity, Country {}
