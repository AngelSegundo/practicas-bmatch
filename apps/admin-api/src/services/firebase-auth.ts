import { User } from "domain/entities";
import { AuthProvider } from "domain/interfaces";
import { UserAuthData } from "domain/services/auth-service";
import { getAuth } from "firebase-admin/auth";

const auth = getAuth();

export class FirebaseAuthProvider implements AuthProvider {
  createUser(data: User): Promise<UserAuthData> {
    throw new Error("Method not implemented.");
  }
}
