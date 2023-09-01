import zod from "zod";
import { BaseEntity, BaseEntitySchema } from "./base";
import { CommunityDTO } from "./community";

export const USER_ID_PREFIX = "use";
export const USER_TABLE_NAME = "users";

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending",
  deleted = "deleted",
}
export interface User {
  name: string;
  surname: string;
  taxId: string;
  communityIds: string[];
  communitiesData?: CommunityDTO[];
  sponsorId: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  countryId: string;
  status: UserStatus;
  disabled?: boolean;
  scoring?: {
    currentRanking: number;
    previousRanking: number;
    currentRankingId: string;
    savings: number;
  };
}

export const UserSchema = zod.object({
  name: zod.string(),
  surname: zod.string(),
  taxId: zod.string(),
  communityIds: zod.array(zod.string()),
  sponsorId: zod.string(),
  email: zod.string().email(),
  phone: zod.string().optional(),
  profilePicture: zod.string().optional(),
  countryId: zod.string(),
  status: zod.nativeEnum(UserStatus),
});

export const UserDTOSchema = UserSchema.merge(BaseEntitySchema);

export interface UserDTO extends BaseEntity, User {}
