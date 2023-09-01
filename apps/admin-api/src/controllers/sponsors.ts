import { Body, Get, Patch, Path, Post, Route } from "tsoa";
import { Sponsor, SponsorDTO } from "domain/entities";
import { CommunityRepository, SponsorRepository } from "domain/repositories";
import {
  CreateSponsorUseCaseImpl,
  GetSponsorByIdUseCaseImpl,
  GetSponsorsUseCaseImpl,
  UpdateSponsorUseCaseImpl,
} from "domain/useCases";

@Route("sponsors")
export default class SponsorController {
  private sponsorRepository: SponsorRepository;
  private communityRepository: CommunityRepository;
  constructor(
    sponsorRepository: SponsorRepository,
    communityRepository: CommunityRepository
  ) {
    this.sponsorRepository = sponsorRepository;
    this.communityRepository = communityRepository;
  }

  @Get("/")
  public getAll(): Promise<SponsorDTO[]> {
    const useCase = new GetSponsorsUseCaseImpl(this.sponsorRepository);
    return useCase.execute();
  }

  @Get("{sponsorId}")
  public getById(sponsorId: string): Promise<SponsorDTO> {
    const useCase = new GetSponsorByIdUseCaseImpl(this.sponsorRepository);
    return useCase.execute(sponsorId);
  }

  @Post("/")
  public createSponsor(@Body() sponsor: Sponsor): Promise<SponsorDTO> {
    const useCase = new CreateSponsorUseCaseImpl(
      this.sponsorRepository,
      this.communityRepository
    );
    return useCase.execute(sponsor);
  }
  @Patch("/{id}")
  public updateSponsor(
    @Body() sponsor: Partial<Sponsor>,
    @Path() id: string
  ): Promise<SponsorDTO> {
    const useCase = new UpdateSponsorUseCaseImpl({
      sponsorRepository: this.sponsorRepository,
    });
    return useCase.execute({ sponsor, id });
  }
}
