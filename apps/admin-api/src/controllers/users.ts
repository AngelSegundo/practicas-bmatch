import { Body, Get, Put, Patch, Path, Post, Route, Query, Delete } from "tsoa";
import {
  CommunityDTO,
  COMMUNITY_TABLE_NAME,
  InvitationDTO,
  INVITATION_TABLE_NAME,
  User,
  UserDTO,
  USER_TABLE_NAME,
} from "domain/entities";
import {
  CommunityRepository,
  CommunityRepositoryImpl,
  InvitationRepositoryImpl,
  UserRepository,
  UserRepositoryImpl,
} from "domain/repositories";
import {
  CreateUserUseCaseImpl,
  GetUserByIdUseCaseImpl,
  GetUsersUseCaseImpl,
  UpdateUserUseCaseImpl,
  SetUserProfilePictureUseCaseImpl,
  GetCommunityByIdUseCaseImpl,
  GetInvitationsByTaxIdUseCaseImpl,
  ConsumeInvitationUseCaseImpl,
  GetUsersBySponsorIdUseCaseImpl,
  GetUsersByCommunityIdUseCaseImpl,
  DeleteUserUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { UserAuthData } from "domain/services/auth-service";
import { FileData, StorageService } from "domain/services";

@Route("users")
export default class UserController {
  private userRepository: UserRepository;
  private storageService: StorageService;
  private communityRepository: CommunityRepository;
  private invitationRepository: InvitationRepositoryImpl;

  constructor(database: Database, storageService: StorageService) {
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
    this.communityRepository = new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    );
    this.invitationRepository = new InvitationRepositoryImpl(
      new DataSourceImpl<InvitationDTO>(database, INVITATION_TABLE_NAME)
    );
    this.storageService = storageService;
  }

  @Get("/")
  public getAll(
    @Query()
    sponsorId?: string,
    communityId?: string
  ): Promise<UserDTO[]> {
    if (communityId) {
      const useCase = new GetUsersByCommunityIdUseCaseImpl({
        userRepository: this.userRepository,
        storageService: this.storageService,
      });
      return useCase.execute(communityId);
    }
    if (sponsorId) {
      const useCase = new GetUsersBySponsorIdUseCaseImpl({
        userRepository: this.userRepository,
        storageService: this.storageService,
      });
      return useCase.execute(sponsorId);
    }
    const useCase = new GetUsersUseCaseImpl({
      userRepository: this.userRepository,
      storageService: this.storageService,
    });
    return useCase.execute();
  }

  @Get("{userId}")
  public async getById(
    @Path() userId: string,
    @Query() includeCommunities: boolean
  ): Promise<UserDTO> {
    const useCase = new GetUserByIdUseCaseImpl({
      userRepository: this.userRepository,
      storageService: this.storageService,
    });
    const user = await useCase.execute(userId);
    if (includeCommunities && user) {
      const getCommunityByIdUseCase = new GetCommunityByIdUseCaseImpl({
        communityRepository: this.communityRepository,
        storageService: this.storageService,
      });
      const communities = await Promise.all(
        user.communityIds.map(async (communityId) => {
          return await getCommunityByIdUseCase.execute(communityId);
        })
      );
      user.communitiesData = communities;
    }
    return user;
  }

  @Post("/")
  public async createUser(
    @Body() data: User & UserAuthData
  ): Promise<Promise<UserDTO> | string> {
    const { id, ...user } = data;
    const useCreateUserCase = new CreateUserUseCaseImpl({
      userRepository: this.userRepository,
    });
    const useGetInvitationsByTaxIdCase = new GetInvitationsByTaxIdUseCaseImpl(
      this.invitationRepository,
      this.communityRepository
    );
    const useConsumeInvitation = new ConsumeInvitationUseCaseImpl(
      this.invitationRepository
    );
    
    const invitations = await useGetInvitationsByTaxIdCase.execute(user.taxId);

    const invitationIds = invitations.map((inv) => inv.id);
    if (invitations.some((inv) => inv.isConsumed === true)) {
      throw Error("El usuario ya ha consumido la invitación");
    }
    const userDTO = useCreateUserCase.execute({ user, id });
    await useConsumeInvitation.execute(invitationIds);
    return userDTO;
  }

  @Patch("/{id}")
  public updateUser(
    @Body() user: Partial<User>,
    @Path() id: string
  ): Promise<UserDTO> {
    const useCase = new UpdateUserUseCaseImpl({
      userRepository: this.userRepository,
    });
    return useCase.execute({ user, id });
  }

  @Delete("/{id}")
  public deleteUser(
    @Path() id: string
  ): Promise<void> {
    const useCase = new DeleteUserUseCaseImpl(this.userRepository, this.invitationRepository);
    return useCase.execute(id);
  }

  @Put("/{id}/picture-profile")
  public updateUserPictureProfile(
    @Body() profilePicture: FileData,
    @Path() id: string
  ): Promise<UserDTO> {
    const useCase = new SetUserProfilePictureUseCaseImpl({
      userRepository: this.userRepository,
      storageService: this.storageService,
    });
    return useCase.execute({ profilePicture, id });
  }
}
