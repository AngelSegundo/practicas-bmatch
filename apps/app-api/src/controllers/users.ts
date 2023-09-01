import {
  Body,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Request,
  Route,
  Query,
} from "tsoa";
import {
  InvitationDTO,
  INVITATION_TABLE_NAME,
  User,
  UserDTO,
  CommunityDTO,
  USER_TABLE_NAME,
  COMMUNITY_TABLE_NAME,
} from "domain/entities";
import {
  InvitationRepository,
  InvitationRepositoryImpl,
  UserRepository,
  UserRepositoryImpl,
  CommunityRepository,
  CommunityRepositoryImpl,
} from "domain/repositories";
import {
  GetUserByIdUseCaseImpl,
  UpdateUserUseCaseImpl,
  SetUserProfilePictureUseCaseImpl,
  CreateUserUseCaseImpl,
  GetInvitationsByTaxIdUseCaseImpl,
  ConsumeInvitationUseCaseImpl,
  DeleteUserUseCaseImpl,
  GetUsersByCommunityIdUseCaseImpl,
  GetUsersBySponsorIdUseCaseImpl,
  GetUsersUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { FileData, StorageService } from "domain/services";
import { Request as ExpressRequest } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

@Route("users")
export default class UserController {
  private userRepository: UserRepository;
  private storageService: StorageService;
  private invitationRepository: InvitationRepository;
  private communityRepository: CommunityRepository;

  constructor(database: Database, storageService: StorageService) {
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
    this.invitationRepository = new InvitationRepositoryImpl(
      new DataSourceImpl<InvitationDTO>(database, INVITATION_TABLE_NAME)
    );
    this.storageService = storageService;
    this.communityRepository = new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    );
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

  @Post("/me")
  public async createMyUser(
    @Request() request: ExpressRequest,
    @Body() userData: User
  ): Promise<Promise<UserDTO> | string> {
    const authToken = request.auth as DecodedIdToken;
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
    const invitations = await useGetInvitationsByTaxIdCase.execute(
      userData.taxId
    );
    const invitationIds = invitations.map((inv) => inv.id);

    if (invitations.some((inv) => inv.isConsumed === true)) {
      throw Error("El usuario ya ha consumido la invitación");
    }
    const userDTO = useCreateUserCase.execute({
      user: { ...userData, communityIds: invitations[0].communityIds },
      id: authToken.uid,
    });
    await useConsumeInvitation.execute(invitationIds);
    return userDTO;
  }

  @Get("/me")
  public getMyUser(@Request() request: ExpressRequest): Promise<UserDTO> {
    const user = request.currentUser as UserDTO;
    const useCase = new GetUserByIdUseCaseImpl({
      userRepository: this.userRepository,
      storageService: this.storageService,
    });
    return useCase.execute(user.id);
  }

  @Patch("/me")
  public updateUser(
    @Request() request: ExpressRequest,
    @Body() userData: Partial<User>
  ): Promise<UserDTO> {
    const user = request.currentUser as UserDTO;
    const useCase = new UpdateUserUseCaseImpl({
      userRepository: this.userRepository,
    });
    return useCase.execute({ id: user.id, user: userData });
  }

  @Put("/me/profile-picture")
  public updateUserPictureProfile(
    @Request() request: ExpressRequest,
    @Body() profilePicture: FileData
  ): Promise<UserDTO> {
    const user = request.currentUser as UserDTO;

    const useCase = new SetUserProfilePictureUseCaseImpl({
      userRepository: this.userRepository,
      storageService: this.storageService,
    });

    return useCase.execute({ profilePicture, id: user.id });
  }
  @Delete("/me")
  public deleteById(@Request() request: ExpressRequest): Promise<void> {
    const user = request.currentUser as UserDTO;
    const useCase = new DeleteUserUseCaseImpl(
      this.userRepository,
      this.invitationRepository
    );
    return useCase.execute(user.id);
  }
}
