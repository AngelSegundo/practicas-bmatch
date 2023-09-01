import { Body, Get, Path, Post, Put, Query, Request, Route } from "tsoa";
import {
  Community,
  CommunityDTO,
  COMMUNITY_TABLE_NAME,
  ServiceConnectionDTO,
  ServiceDTO,
  ServiceReadingDTO,
  SERVICE_CONNECTION_TABLE_NAME,
  SERVICE_READING_TABLE_NAME,
  SERVICE_TABLE_NAME,
  SponsorDTO,
  SPONSOR_TABLE_NAME,
  UserDTO,
  USER_TABLE_NAME,
} from "domain/entities";
import {
  CommunityRepository,
  CommunityRepositoryImpl,
} from "domain/repositories/community-repository";
import {
  GetCommunitiesUseCaseImpl,
  GetCommunityByIdUseCaseImpl,
  CreateCommunityUseCaseImpl,
  SetCommunityLogoUseCaseImpl,
  GetCommunityIdByAccessCodeUseCaseImpl,
  UpdateUserUseCaseImpl,
  GetCommunityDetailedByIdUseCaseImpl,
  GetSponsorByIdUseCaseImpl,
  GetPublicCommunitiesBySearchTextUseCaseImpl,
} from "domain/useCases";
import { Request as ExpressRequest } from "express";
import { Database, DataSourceImpl } from "domain/interfaces";
import { FileData, StorageService } from "domain/services";
import {
  ServiceConnectionRepository,
  ServiceConnectionRepositoryImpl,
  ServiceReadingRepository,
  ServiceReadingRepositoryImpl,
  ServiceRepository,
  ServiceRepositoryImpl,
  SponsorRepository,
  SponsorRepositoryImpl,
  UserRepository,
  UserRepositoryImpl,
} from "domain/repositories";

@Route("communities")
export default class CommunityController {
  private communityRepository: CommunityRepository;
  private storageService: StorageService;
  private userRepository: UserRepository;
  private serviceRepository: ServiceRepository;
  private serviceConnectionRepository: ServiceConnectionRepository;
  private serviceReadingRepository: ServiceReadingRepository;
  private sponsorRepository: SponsorRepository;

  constructor(database: Database, storageService: StorageService) {
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
    this.communityRepository = new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    );
    this.sponsorRepository = new SponsorRepositoryImpl(
      new DataSourceImpl<SponsorDTO>(database, SPONSOR_TABLE_NAME)
    );
    this.storageService = storageService;
    this.serviceReadingRepository = new ServiceReadingRepositoryImpl(
      new DataSourceImpl<ServiceReadingDTO>(
        database,
        SERVICE_READING_TABLE_NAME
      )
    );
    this.serviceConnectionRepository = new ServiceConnectionRepositoryImpl(
      new DataSourceImpl<ServiceConnectionDTO>(
        database,
        SERVICE_CONNECTION_TABLE_NAME
      )
    );
    this.serviceRepository = new ServiceRepositoryImpl(
      new DataSourceImpl<ServiceDTO>(database, SERVICE_TABLE_NAME)
    );
  }
  @Post("/")
  public async createCommunity(
    @Request() request: ExpressRequest,
    @Body() community: Community
  ): Promise<CommunityDTO> {
    let user = request.currentUser as UserDTO;
    const useCreateCommunityCase = new CreateCommunityUseCaseImpl(
      this.communityRepository
    );
    const useJoinCommunityCase = new UpdateUserUseCaseImpl({
      userRepository: this.userRepository,
    });
    const useSponsorGetCase = new GetSponsorByIdUseCaseImpl(
      this.sponsorRepository
    );
    const sponsor = await useSponsorGetCase.execute(user.sponsorId);
    if (user && sponsor)
      community = {
        ...community,
        sponsorName: sponsor.commercialName,
        founderId: user.id,
        isCorporate: false,
      };
    const communityDTO = useCreateCommunityCase.execute(community);
    const communityIdsUpdated = [...user.communityIds, (await communityDTO).id];
    user = { ...user, communityIds: communityIdsUpdated };
    useJoinCommunityCase.execute({ user: user, id: user.id });
    return communityDTO;
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
    const communityDTO = useCase.execute({ profilePicture, id });
    return communityDTO;
  }
  @Get("/")
  public getCommunities(): Promise<CommunityDTO[]> {
    const useCase = new GetCommunitiesUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    return useCase.execute();
  }
  @Get("/searchText")
  public getPublicCommunitiesBySearchText(
    @Query() searchText: string
  ): Promise<CommunityDTO[]> {
    const useCase = new GetPublicCommunitiesBySearchTextUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    return useCase.execute(searchText);
  }
  @Get("/me")
  public getMyCommunities(
    @Request() request: ExpressRequest
  ): Promise<CommunityDTO[]> {
    const { communityIds } = request.currentUser as UserDTO;
    const useCase = new GetCommunityByIdUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    const communities = Promise.all(
      communityIds.map((communityId) => {
        return useCase.execute(communityId);
      })
    );
    return communities;
  }
  @Get("/private")
  public async getCommunityIdByAccessCode(
    @Request() request: ExpressRequest,
    @Query() accessCode?: string
  ): Promise<{ communityId: string } | undefined> {
    const user = request.currentUser as UserDTO;
    const useGetCommunityById = new GetCommunityByIdUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    const useGetCommunityIdByAccessCodeCase =
      new GetCommunityIdByAccessCodeUseCaseImpl({
        communityRepository: this.communityRepository,
      });
    if (accessCode) {
      const communityIdBody = await useGetCommunityIdByAccessCodeCase.execute(
        accessCode
      );
      if (communityIdBody?.communityId) {
        const community = await useGetCommunityById.execute(
          communityIdBody?.communityId
        );
        if (
          community &&
          community.isCorporate === true &&
          community.founderId !== user.sponsorId
        ) {
          throw new Error("You can not access to this community");
        } else return communityIdBody;
      }
    }
    throw new Error("You need access code to view the community");
  }
  @Get("/{communityId}")
  public async getById(
    @Request() request: ExpressRequest,
    @Query() accessCode: string,
    @Path() communityId: string
  ): Promise<CommunityDTO> {
    const useCase = new GetCommunityByIdUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    const user = request.currentUser as UserDTO;
    const community = useCase.execute(await communityId);
    if (
      (await community).isPublic ||
      user.communityIds.some((id) => id === communityId) ||
      ((await community).isPublic === false &&
        (await community).accessCode === accessCode)
    )
      return community;
    else
      throw new Error(
        "You need a correct access code to view a private community"
      );
  }
  @Get("/{communityId/detailed}")
  public async getDetailedById(
    @Request() request: ExpressRequest,
    @Query() accessCode: string,
    @Path() communityId: string
  ): Promise<CommunityDTO> {
    const useCase = new GetCommunityDetailedByIdUseCaseImpl(
      this.communityRepository,
      this.serviceReadingRepository,
      this.userRepository,
      this.serviceRepository,
      this.storageService
    );
    const user = request.currentUser as UserDTO;
    const community = useCase.execute(await communityId);
    if (
      (await community).isPublic ||
      user.communityIds.some((id) => id === communityId) ||
      ((await community).isPublic === false &&
        (await community).accessCode === accessCode)
    )
      return community;
    else
      throw new Error(
        "You need a correct access code to view a private community"
      );
  }

  @Put("/{communityId}/join")
  public async joinTheCommunity(
    @Request() request: ExpressRequest,
    @Body() accessCode: string,
    @Path() communityId: string
  ): Promise<UserDTO> {
    const useGetCommunityByIdUseCase = new GetCommunityByIdUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    const useJoinCommunityCase = new UpdateUserUseCaseImpl({
      userRepository: this.userRepository,
    });
    let user = request.currentUser as UserDTO;
    const community = await useGetCommunityByIdUseCase.execute(communityId);
    if (
      community &&
      community.isCorporate === true &&
      community.founderId !== user.sponsorId
    ) {
      throw new Error("You can not belong to this community");
    }

    if (user.communityIds.some((comId) => comId === communityId))
      throw new Error("You´re already a member of the community");
    if (community.isPublic === false) {
      //Volvemos a checkear el access code
      if (community.accessCode === accessCode) {
        const communityIdsUpdated = [...user.communityIds, communityId];
        user = { ...user, communityIds: communityIdsUpdated };
        return useJoinCommunityCase.execute({ user: user, id: user.id });
      }
    } else {
      const communityIdsUpdated = [...user.communityIds, communityId];
      user = { ...user, communityIds: communityIdsUpdated };
      return useJoinCommunityCase.execute({ user: user, id: user.id });
    }
    throw new Error("The code does not match to join to community");
  }

  @Put("/{communityId}/leave")
  public async leaveTheCommunity(
    @Request() request: ExpressRequest,
    @Path() communityId: string
  ): Promise<UserDTO> {
    const useGetCommunityByIdUseCase = new GetCommunityByIdUseCaseImpl({
      communityRepository: this.communityRepository,
      storageService: this.storageService,
    });
    const useLeaveCommunityCase = new UpdateUserUseCaseImpl({
      userRepository: this.userRepository,
    });
    let user = request.currentUser as UserDTO;
    const community = await useGetCommunityByIdUseCase.execute(communityId);
    if (!user.communityIds.some((comId) => comId === communityId))
      throw new Error(
        "You cannot leave because you are not a member of the community"
      );
    if (community.isSponsorDefault === true)
      throw new Error("You cannot leave your sponsor's community.");
    else {
      const communityIdsUpdated = user.communityIds.filter(
        (id) => id !== communityId
      );
      user = { ...user, communityIds: communityIdsUpdated };
      return useLeaveCommunityCase.execute({ user: user, id: user.id });
    }
  }
}
