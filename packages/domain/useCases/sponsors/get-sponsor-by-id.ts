import { SponsorDTO } from "../../entities/sponsor";
import { SponsorRepository } from "../../repositories/sponsor-repository";

export interface GetSponsorByIdUseCase {
  execute(id: string): Promise<SponsorDTO>;
}

export class GetSponsorByIdUseCaseImpl implements GetSponsorByIdUseCase {
  sponsorRepository: SponsorRepository;
  constructor(sponsorRepository: SponsorRepository) {
    this.sponsorRepository = sponsorRepository;
  }

  execute(id: string): Promise<SponsorDTO> {
    return this.sponsorRepository.getSponsorById(id);
  }
}
