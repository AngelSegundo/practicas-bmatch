import { BaseEntity } from "./base";
import { CommunityDTO } from "./community";

export const INVITATION_TABLE_NAME = "invitations";

export const INVITATION_ID_PREFIX = "inv";

export interface Invitation {
  name: string;
  surname: string;
  email: string;
  taxId: string;
  sponsorId: string;
  sponsorName: string;
  communityIds: string[];
  communitiesData?: CommunityDTO[];
  countryId: string;
  isConsumed: boolean;
}

export interface InvitationForm {
  email: string;
  name: string;
  surname: string;
  taxId: string;
}

export interface InvitationDTO extends BaseEntity, Invitation {}
