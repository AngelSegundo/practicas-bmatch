import { User } from "../entities";
import { AuthProvider } from "../interfaces";
import { UserAuthData } from "../services";
import { generateKsuid } from "./ids";

export class MockAuthProvider implements AuthProvider {
  createUser(data: User): Promise<UserAuthData> {
    const id = generateKsuid();
    return Promise.resolve({ id });
  }
}
