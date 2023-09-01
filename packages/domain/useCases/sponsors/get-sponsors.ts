import { SponsorDTO } from "../../entities/sponsor";
import { SponsorRepository } from "../../repositories/sponsor-repository";

export interface GetSponsorsUseCase {
  execute(): Promise<SponsorDTO[]>;
}

export class GetSponsorsUseCaseImpl implements GetSponsorsUseCase {
  sponsorRepository: SponsorRepository;
  constructor(sponsorRepository: SponsorRepository) {
    this.sponsorRepository = sponsorRepository;
  }

  async execute(): Promise<SponsorDTO[]> {
    return this.sponsorRepository.getSponsors();
  }
}
