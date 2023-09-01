import { User } from "../entities";
import { UserAuthData } from "../services/auth-service";

export interface AuthProvider {
  createUser(data: User): Promise<UserAuthData>;
}
