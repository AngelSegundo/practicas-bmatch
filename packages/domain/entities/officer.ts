import { BaseEntity } from "./base";

export const OFFICER_TABLE_NAME = "officers";

export enum OfficerRoles {
  ADMIN = "admin",
}

export interface Officer {
  name: string;
  surname: string;
  email: string;
  role: OfficerRoles;
  profilePicture?: string;
}

export interface OfficerDTO extends Officer, BaseEntity {}
