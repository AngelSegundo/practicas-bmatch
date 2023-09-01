import { DataSource } from "../interfaces";
import { Invitation, InvitationDTO, INVITATION_ID_PREFIX } from "../entities";
import { QuerySearchTypes } from "../interfaces";
import { generateKsuid } from "../utilities/ids";

export interface InvitationRepository {
  getInvitations(): Promise<InvitationDTO[]>;
  getInvitationsByTaxId(taxId: string): Promise<InvitationDTO[]>;
  createInvitation(data: Invitation): Promise<InvitationDTO>;
  consumeInvitation(invitationIds: string[]): Promise<InvitationDTO>[];
  getInvitationsBySponsorId(sponsorId: string): Promise<InvitationDTO[]>;
  getInvitationsByEmail(email: string): Promise<InvitationDTO[]>;
  deleteInvitation(id: string): Promise<void>;
}

export class InvitationRepositoryImpl implements InvitationRepository {
  private dataSource: DataSource<InvitationDTO>;
  constructor(dataSource: DataSource<InvitationDTO>) {
    this.dataSource = dataSource;
  }
  async getInvitations(): Promise<InvitationDTO[]> {
    return this.dataSource.getAll();
  }
  async getInvitationsBySponsorId(sponsorId: string): Promise<InvitationDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "sponsorId",
        searchType: QuerySearchTypes.EQUALS,
        value: sponsorId,
      },
    ]);
  }
  async getInvitationsByTaxId(taxId: string): Promise<InvitationDTO[]> {
    const invitations = await this.dataSource.find([
      { fieldName: "taxId", searchType: QuerySearchTypes.EQUALS, value: taxId },
    ]);
    return invitations;
  }

  createInvitation(data: Invitation): Promise<InvitationDTO> {
    const datetime = new Date().toISOString();
    const invitation = {
      ...data,
      id: generateKsuid(INVITATION_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as InvitationDTO;
    return this.dataSource.create(invitation);
  }
  consumeInvitation(invitationIds: string[]): Promise<InvitationDTO>[] {
    const datetime = new Date().toISOString();
    const invitation = {
      isConsumed: true,
      updatedAt: datetime,
    } as InvitationDTO;
    const invitationsDTO = invitationIds.map((invitationId) =>
      this.dataSource.update(invitationId, invitation)
    );
    return invitationsDTO;
  }
  getInvitationsByEmail(email: string): Promise<InvitationDTO[]> {
    return this.dataSource.find([
      { fieldName: "email", searchType: QuerySearchTypes.EQUALS, value: email },
    ]);
  }
  deleteInvitation(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}
