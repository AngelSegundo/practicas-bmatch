import { Community, CommunityDTO, COMMUNITY_TABLE_NAME, UserDTO, USER_TABLE_NAME } from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
  CommunityRepository,
  CommunityRepositoryImpl,
} from "domain/repositories/community-repository";
import { UserRepository, UserRepositoryImpl } from "../../../../packages/domain/repositories";
import { FileData, StorageService } from "domain/services";
import {
  GetCommunitiesUseCaseImpl,
  GetCommunityByIdUseCaseImpl,
  CreateCommunityUseCaseImpl,
  GetCommunitiesBySponsorIdUseCaseImpl,
  SetCommunityLogoUseCaseImpl,
  UpdateCommunityUseCaseImpl,
  DeleteCommunityUseCaseImpl,
} from "domain/useCases";
import { Body, Delete, Get, Patch, Path, Post, Put, Query, Route } from "tsoa";

@Route("communities")
export default class CommunityController {
  private communityRepository: CommunityRepository;
  private storageService: StorageService;
  private userRepository: UserRepository;

  constructor(database: Database, storageService: StorageService) {
    this.communityRepository = new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    );
    this.storageService = storageService;
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
  }

  @Get("/")
  public async getCommunities(
    @Query() sponsorId?: string,
    @Query() withPublics?: boolean
  ): Promise<CommunityDTO[]> {
    if (sponsorId && !withPublics) {
      const useCase = new GetCommunitiesBySponsorIdUseCaseImpl({
        communityRepository: this.communityRepository,
        storageService: this.storageService,
      });
      return useCase.execute(sponsorId);
    }
    const useCase = new GetCommunitiesUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    if (sponsorId && withPublics) {
      return (await useCase.execute()).filter(
        (com) => com.isPublic === true || com.sponsorId == sponsorId
      );
    }
    return useCase.execute();
  }

  @Get("{communityId}")
  public getById(communityId: string): Promise<CommunityDTO> {
    const useCase = new GetCommunityByIdUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    return useCase.execute(communityId);
  }

  @Post("/")
  public createCommunity(@Body() community: Community): Promise<CommunityDTO> {
    const useCase = new CreateCommunityUseCaseImpl(this.communityRepository);
    return useCase.execute(community);
  }
  @Put("/{id}/logo")
  public updateCommunityLogo(
    @Body() profilePicture: FileData,
    @Path() id: string
  ): Promise<CommunityDTO> {
    const useCase = new SetCommunityLogoUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    return useCase.execute({ profilePicture, id });
  }
  @Patch("/{id}")
  public updateCommunity(
    @Body() community: Partial<Community>,
    @Path() id: string
  ): Promise<CommunityDTO> {
    const useCase = new UpdateCommunityUseCaseImpl({
      communityRepository: this.communityRepository,
    });
    return useCase.execute({ community, id });
  }
  @Delete("/{id}")
  public deleteCommunity(@Path() id: string): Promise<void> {
    const useCase = new DeleteCommunityUseCaseImpl({
      communityRepository: this.communityRepository,
      userRepository: this.userRepository,
    });
    return useCase.execute({ id });
  }
}
