import { User } from "../entities";
import { AuthProvider } from "../interfaces";

export interface UserAuthData {
  id: string;
}

// por ahora no lo usamos

export interface AuthService {
  createUser(data: User): Promise<UserAuthData>;
}

export class AuthServiceImpl {
  private provider: AuthProvider;
  constructor(provider: AuthProvider) {
    this.provider = provider;
  }

  createUser(data: User): Promise<UserAuthData> {
    return this.provider.createUser(data);
  }
}
