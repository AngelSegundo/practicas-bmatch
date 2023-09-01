import { RankingCommunityDTO } from "../../entities/rankingCommunity";
import {
  UserRepository,
  CommunityRepository,
  RankingCommunityRepository,
} from "../../repositories";

export interface GetCommunityRankingUseCaseInput {
  userRepository: UserRepository;
}

export interface GetCommunityRankingUseCase {
  execute(): Promise<RankingCommunityDTO[]>;
}

export class GetCommunityRankingUseCaseImpl
  implements GetCommunityRankingUseCase
{
  private userRepository: UserRepository;
  private rankingCommunityRepository: RankingCommunityRepository;
  private communityRepository: CommunityRepository;

  constructor(
    userRepository: UserRepository,
    rankingCommunityRepository: RankingCommunityRepository,
    communityRepository: CommunityRepository
  ) {
    this.userRepository = userRepository;
    this.rankingCommunityRepository = rankingCommunityRepository;
    this.communityRepository = communityRepository;
  }

  async execute(): Promise<RankingCommunityDTO[]> {
    const communities = await this.communityRepository.getCommunities();
    const date = new Date();

    await Promise.all(
      communities.map(async (community) => {
        let previous_ranking = 0;
        const rankingsUserId = await this.rankingCommunityRepository
          .getCommunityRankingsByCommunityId(community.id)
          .catch((error) => console.log(error));
        if (rankingsUserId && rankingsUserId.length > 1) {
          previous_ranking =
            rankingsUserId[rankingsUserId.length - 2].rankingCommunity;
        }
        {
          const usersCommunity = await this.userRepository
            .getUsersByCommunityId(community.id)
            .catch((error) => console.log(error));
          if (usersCommunity) {
            const allSavings: number = (await usersCommunity).reduce(
              (allSavings, currentUser) => {
                let savings = 0;
                if (currentUser.scoring?.savings)
                  savings = currentUser.scoring.savings;
                return allSavings + savings;
              },
              0
            );

            await this.rankingCommunityRepository.createCommunityRanking({
              communityId: community.id,
              month: date.getMonth().toString(),
              year: date.getFullYear().toString(),
              savings: allSavings,
              rankingCommunity: 1,
              previous_ranking_community: previous_ranking,
            });
          }
        }
      })
    );
    const rankingsAfter: RankingCommunityDTO[] =
      await this.rankingCommunityRepository.getCommunityRankings();

    const rankingOrdered = Promise.all(
      rankingsAfter
        .sort((a, b) => b.savings - a.savings)
        .map((rankingAfter, rankingIndexOrder) => {
          this.communityRepository.updateCommunity(
            {
              scoring: {
                currentRanking: rankingIndexOrder + 1,
                previousRanking: rankingAfter.previous_ranking_community,
                currentRankingId: rankingAfter.id,
                savings: rankingAfter.savings,
              },
            },
            rankingAfter.communityId
          );
          return this.rankingCommunityRepository.updateCommunityRanking(
            {
              ...rankingAfter,
              rankingCommunity: rankingIndexOrder + 1,
              previous_ranking_community:
                rankingAfter.previous_ranking_community,
            },
            rankingAfter.id
          );
        })
    );
    return rankingOrdered;
  }
}
