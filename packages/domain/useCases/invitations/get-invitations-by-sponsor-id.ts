import { InvitationDTO } from "../../entities";
import { InvitationRepository } from "../../repositories";
export interface GetInvitationsBySponsorIdUseCaseInput {
  repository: InvitationRepository;
}
export interface GetInvitationsBySponsorIdUseCase {
  execute(sponsorID: string): Promise<InvitationDTO[]>;
}
export class GetInvitationsBySponsorIdUseCaseImpl
  implements GetInvitationsBySponsorIdUseCase
{
  private repository: InvitationRepository;
  constructor(props: GetInvitationsBySponsorIdUseCaseInput) {
    this.repository = props.repository;
  }
  execute(sponsorID: string): Promise<InvitationDTO[]> {
    return this.repository.getInvitationsBySponsorId(sponsorID);
  }
}
