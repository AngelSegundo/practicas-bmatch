import { Sponsor, SponsorDTO } from "../../entities";
import { SponsorRepository } from "../../repositories";

export interface UpdateSponsorUseCaseInput {
  id: string;
  sponsor: Partial<Sponsor>;
}
export interface UpdateSponsorUseCase {
  execute(input: UpdateSponsorUseCaseInput): Promise<SponsorDTO>;
}

export interface UpdateSponsorUseCaseProps {
  sponsorRepository: SponsorRepository;
}

export class UpdateSponsorUseCaseImpl implements UpdateSponsorUseCase {
  sponsorRepository: SponsorRepository;
  constructor(props: UpdateSponsorUseCaseProps) {
    this.sponsorRepository = props.sponsorRepository;
  }

  async execute(input: UpdateSponsorUseCaseInput): Promise<SponsorDTO> {
    const { sponsor, id } = input;
    return this.sponsorRepository.updateSponsor(sponsor, id);
  }
}
