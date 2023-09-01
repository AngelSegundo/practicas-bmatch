import { Get, Request, Route } from "tsoa";
import { SponsorDTO, SPONSOR_TABLE_NAME, UserDTO } from "domain/entities";
import { SponsorRepository, SponsorRepositoryImpl } from "domain/repositories";
import { GetSponsorByIdUseCaseImpl } from "domain/useCases";
import { Request as ExpressRequest } from "express";
import { Database, DataSourceImpl } from "domain/interfaces";

@Route("sponsors")
export default class SponsorController {
  private sponsorRepository: SponsorRepository;
  constructor(database: Database) {
    this.sponsorRepository = new SponsorRepositoryImpl(
      new DataSourceImpl<SponsorDTO>(database, SPONSOR_TABLE_NAME)
    );
  }

  @Get("/me")
  public getMySponsor(@Request() request: ExpressRequest): Promise<SponsorDTO> {
    const user = request.currentUser as UserDTO;

    const useCase = new GetSponsorByIdUseCaseImpl(this.sponsorRepository);
    return useCase.execute(user.sponsorId);
  }
}
