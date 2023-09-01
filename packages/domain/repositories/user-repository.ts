import { UserStatus } from "../entities";
import { User, UserDTO } from "../entities/user";
import { QuerySearchTypes } from "../interfaces";
import { DataSource } from "../interfaces/data-source";

export interface UserRepository {
  getUsers(): Promise<UserDTO[]>;
  getUserById(id: string): Promise<UserDTO>;
  createUser(data: User, id: string): Promise<UserDTO>;
  updateUser(data: Partial<User>, id: string): Promise<UserDTO>;
  getUsersBySponsorId(sponsorId: string): Promise<UserDTO[]>;
  getUsersByCommunityId(communityId: string): Promise<UserDTO[]>;
  deleteUser(id: string): Promise<void>;
}
export class UserRepositoryImpl implements UserRepository {
  dataSource: DataSource<UserDTO>;
  constructor(dataSource: DataSource<UserDTO>) {
    this.dataSource = dataSource;
  }
  async getUsers(): Promise<UserDTO[]> {
    return this.dataSource.getAll();
  }
  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.dataSource.getById(id);
    return user;
  }
  async getUsersBySponsorId(sponsorId: string): Promise<UserDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "sponsorId",
        searchType: QuerySearchTypes.EQUALS,
        value: sponsorId,
      },
    ]);
  }
  async getUsersByCommunityId(communityId: string): Promise<UserDTO[]> {
    return this.dataSource.find([
      {
        fieldName: "communityIds",
        searchType: QuerySearchTypes.ARRAY_CONTAINS,
        value: communityId,
      },
    ]);
  }
  async createUser(data: User, id: string): Promise<UserDTO> {
    const datetime = new Date().toISOString();
    const user = {
      ...data,
      id,
      createdAt: datetime,
      updatedAt: datetime,
      disabled: false,
    } as UserDTO;
    return this.dataSource.create(user);
  }

  async updateUser(data: Partial<User>, id: string): Promise<UserDTO> {
    const datetime = new Date().toISOString();
    const user = data as Partial<UserDTO>;
    user.updatedAt = datetime;
    return this.dataSource.update(id, user);
  }
  async deleteUser(id: string): Promise<void> {
    this.dataSource.update(id, {status: UserStatus.deleted});
  }
}
