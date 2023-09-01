import { Community } from "../../entities";
import { Sponsor, SponsorDTO } from "../../entities/sponsor";
import { CommunityRepository } from "../../repositories";
import { SponsorRepository } from "../../repositories/sponsor-repository";

export interface CreateSponsorUseCase {
  execute(data: Sponsor): Promise<SponsorDTO>;
}

export class CreateSponsorUseCaseImpl implements CreateSponsorUseCase {
  sponsorRepository: SponsorRepository;
  communityRepository: CommunityRepository;
  constructor(
    sponsorRepository: SponsorRepository,
    communityRepository: CommunityRepository
  ) {
    this.sponsorRepository = sponsorRepository;
    this.communityRepository = communityRepository;
  }

  async execute(data: Sponsor): Promise<SponsorDTO> {
    const sponsor = await this.sponsorRepository.createSponsor(data);
    const community: Community = {
      sponsorId: sponsor.id,
      name: sponsor.commercialName,
      description: `${sponsor.commercialName} Community`,
      countryId: sponsor.countryId,
      isSponsorDefault: true,
      isPublic: false,
      isVisible: false,
      isCorporate: true,
      founderId: sponsor.id,
      status: "active",
    };
    await this.communityRepository.createCommunity(community);
    return sponsor;
  }
}
