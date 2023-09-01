import { User, USER_TABLE_NAME, UserStatus } from "../../entities";
import { DataSourceImpl } from "../../interfaces";
import {
  UserRepository,
  UserRepositoryImpl,
} from "../../repositories/user-repository";
import { MemoryDatabase } from "../../utilities/memory-database";
import {
  CreateUserUseCaseInput,
  CreateUserUseCase,
  CreateUserUseCaseImpl,
} from "./create-user";

jest.mock("../../repositories/user-repository");

describe("create-user use case", () => {
  const repository = jest.mocked<UserRepository>(
    new UserRepositoryImpl(
      new DataSourceImpl(new MemoryDatabase(), USER_TABLE_NAME)
    )
  );
  const sampleId = "sampleId";
  const sampleUser: User = {
    name: "sampleName",
    email: "sampleEmail",
    surname: "sampleSurname",
    communityIds: ["sampleCommunityId"],
    sponsorId: "sampleSponsorId",
    taxId: "sampleTaxId",
    countryId: "sampleCountryId",
    status: UserStatus.active,
    disabled: false,
  };
  const sampleInput: CreateUserUseCaseInput = {
    id: sampleId,
    user: sampleUser,
  };
  let useCase: CreateUserUseCase;
  let userRepository: UserRepository;

  beforeAll(() => {
    useCase = new CreateUserUseCaseImpl({ userRepository: repository });
    userRepository = repository;
  });

  beforeEach(() => {
    repository.createUser.mockClear();
  });

  test("should call userRepository to get user by ID", async () => {
    await useCase.execute(sampleInput);
    expect(repository.createUser).toHaveBeenCalledTimes(1);
    expect(repository.createUser).toHaveBeenCalledWith(sampleUser, sampleId);
  });
});

// esto hace falta para que no chille. Se pone y se ignora
export {};
