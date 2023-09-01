import { User, UserDTO, USER_TABLE_NAME, UserStatus } from "../entities";
import { DataSourceImpl } from "../interfaces/data-source";
import { MemoryDatabase } from "../utilities/memory-database";
import { UserRepository, UserRepositoryImpl } from "./user-repository";

// con esto simplificamos el test
jest.mock("../interfaces/data-source");

const tableName = USER_TABLE_NAME;

describe("UserRepository", () => {
  // al hacer esto podemos usar los helpers de cuantas veces se ha llamado una función etc...
  const dataSource = jest.mocked(
    new DataSourceImpl<UserDTO>(new MemoryDatabase(), tableName),
    true
  );
  let repository: UserRepository;
  beforeAll(() => {
    repository = new UserRepositoryImpl(dataSource);
  });

  beforeEach(() => {
    dataSource.getAll.mockClear();
    dataSource.getById.mockClear();
    dataSource.create.mockClear();
  });

  test("should call datasource to get all users", async () => {
    await repository.getUsers();
    expect(dataSource.getAll).toHaveBeenCalled();
    expect(dataSource.getAll).toHaveBeenCalledTimes(1);
  });

  test("should call datasource to get user by ID", async () => {
    const sampleId = "sampleId";
    await repository.getUserById(sampleId);
    expect(dataSource.getById).toHaveBeenCalledWith(sampleId);
    expect(dataSource.getById).toHaveBeenCalledTimes(1);
  });

  test("should call datasource to create user", async () => {
    const sampleId = "sampleId";
    const sampleUser: User = {
      name: "sampleName",
      email: "sampleEmail",
      surname: "sampleSurname",
      communityIds: ["sampleCommunityId"],
      sponsorId: "sampleSponsorId",
      taxId: "sampleTaxId",
      status: UserStatus.inactive,
      countryId: "sampleCountryId",
    };
    await repository.createUser(sampleUser, sampleId);
    expect(dataSource.create).toHaveBeenCalledTimes(1);
    expect(dataSource.create.mock.lastCall[0].id).toBeDefined();
    expect(dataSource.create.mock.lastCall[0].createdAt).toBeDefined();
    expect(dataSource.create.mock.lastCall[0].updatedAt).toBeDefined();
  });
});

export {};
