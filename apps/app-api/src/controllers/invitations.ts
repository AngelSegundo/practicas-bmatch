import {
  CommunityDTO,
  COMMUNITY_TABLE_NAME,
  InvitationDTO,
  INVITATION_TABLE_NAME,
} from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
  InvitationRepository,
  InvitationRepositoryImpl,
  CommunityRepository,
  CommunityRepositoryImpl,
} from "domain/repositories";
import {
  GetInvitationsByTaxIdUseCaseImpl,
  GetInvitationsByTaxIdWithNameUseCaseImpl,
} from "domain/useCases";
import { Get, Query, Route } from "tsoa";

@Route("invitations")
export default class InvitationController {
  private repository: InvitationRepository;
  private communityRepository: CommunityRepository;

  constructor(database: Database) {
    this.repository = new InvitationRepositoryImpl(
      new DataSourceImpl<InvitationDTO>(database, INVITATION_TABLE_NAME)
    );
    this.communityRepository = new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    );
  }

  @Get("/")
  public getByTaxIdWithName(@Query() taxId: string): Promise<InvitationDTO[]> {
    const useCase = new GetInvitationsByTaxIdWithNameUseCaseImpl(
      this.repository,
      this.communityRepository
    );
    return useCase.execute(taxId);
  }
}
