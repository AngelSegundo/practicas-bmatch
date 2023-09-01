import { InvitationDTO, Invitation } from "domain/entities";
import { InvitationRepository } from "domain/repositories";
import {
  CreateInvitationUseCaseImpl,
  GetInvitationsBySponsorIdUseCaseImpl,
  GetInvitationsUseCaseImpl,
} from "domain/useCases";
import { Get, Post, Body, Query, Route } from "tsoa";
import { SendGridService } from "../services/send-grid";

@Route("invitations")
export default class InvitationController {
  private repository: InvitationRepository;
  constructor(repository: InvitationRepository) {
    this.repository = repository;
  }
  @Get("/")
  public getAll(@Query() sponsorId?: string): Promise<InvitationDTO[]> {
    if (sponsorId) {
      const useCase = new GetInvitationsBySponsorIdUseCaseImpl({
        repository: this.repository,
      });
      return useCase.execute(sponsorId);
    }
    const useCase = new GetInvitationsUseCaseImpl(this.repository);
    return useCase.execute();
  }
  @Post("/")
  public async createInvitation(
    @Body() invitation: Invitation
  ): Promise<InvitationDTO> {
    const useCase = new CreateInvitationUseCaseImpl(this.repository);
    const invitationDTO = await useCase.execute(invitation);
    const sendGrid = new SendGridService();
    const data = {
      emails: [invitationDTO.email],
      bcc: [],
      templateId: "d-8d543cbbf0864a12aaa06cf78e6b5af3",
      templateData: {
        Name: invitationDTO.name,
        Sponsor: invitationDTO.sponsorName,
      },
    };
    await sendGrid
      .sendTemplate(data)
      .then(() => console.log("Successfully sending email"))
      .catch((error) => console.log("Error sending email:", error));

    return invitationDTO;
  }

  @Post("/batch")
  public createManyInvitations(
    @Body() invitations: Invitation[]
  ): Promise<InvitationDTO[]> {
    const createInvitations = Promise.all(
      invitations.map(async (invitation) => {
        const useCase = new CreateInvitationUseCaseImpl(this.repository);
        const invitationDTO = await useCase.execute(invitation);
        const sendGrid = new SendGridService();
        const data = {
          emails: [invitationDTO.email],
          bcc: [],
          templateId: "d-8d543cbbf0864a12aaa06cf78e6b5af3",
          templateData: {
            Name: invitationDTO.name,
            Sponsor: invitationDTO.sponsorName,
          },
        };
        await sendGrid
          .sendTemplate(data)
          .then(() => console.log("Successfully sending email"))
          .catch((error) => console.log("Error sending email:", error));

        return invitationDTO;
      })
    );
    return createInvitations;
  }
}
