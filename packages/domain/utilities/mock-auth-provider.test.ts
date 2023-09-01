import { User, UserStatus } from "../entities/user";
import { MockAuthProvider } from "./mock-auth-provider";

describe("Mock Auth Provider", () => {
  const mockAuthProvider = new MockAuthProvider();

  test("Should return valid Auth User Data", async () => {
    const user: User = {
      communityIds: ["communityId"],
      email: "",
      name: "",
      surname: "",
      taxId: "",
      sponsorId: "",
      countryId: "",
      status: UserStatus.inactive,
    };
    const authUserData = await mockAuthProvider.createUser(user);

    expect(authUserData).toBeDefined();
    expect(authUserData.id).toBeDefined();
  });
});

export {};
