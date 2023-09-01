import {
  createContext,
  useContext,
  useEffect,
  FunctionComponent,
  useState,
} from "react";

import { onIdTokenChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { useAppDispatch, useAppSelector } from "../store/root";
import { setAuth, setIsLoading } from "../store/slices/auth";
import { useRouter } from "next/router";
import { LoadingPage } from "ui";
import {
  useLazyGetOfficerByIdQuery,
  resetApiState,
} from "../store/services/officer";
interface AuthContext {
  isLoading: boolean;
  signIn: (signInData: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
}

const authContext = createContext<AuthContext>({
  isLoading: true,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

const { Provider } = authContext;

const AuthProvider: FunctionComponent<{ children: JSX.Element }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [noUser, setNoUser] = useState(false);

  const [getOfficer, { data: officer, ...getOfficerRequest }] =
    useLazyGetOfficerByIdQuery();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (authState) => {
      const userData = authState ? await authState.getIdTokenResult() : null;

      if (authState && userData) {
        dispatch(setAuth(authState));
        if (authState.uid !== auth.user?.uid) {
          getOfficer(authState.uid);
        }
      } else {
        dispatch(setAuth(null));
        setNoUser(true);
      }
      dispatch(setIsLoading(false));
    });
    return () => unsubscribe();
  }, []);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    dispatch(setIsLoading(true));
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error: unknown) {
      const errorCode = error;
      console.log(errorCode);
      dispatch(setIsLoading(false));
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseAuth.signOut();
    dispatch(setAuth(null));
    dispatch(resetApiState());
  };

  // redirect to companies if logged in
  useEffect(() => {
    if (!getOfficerRequest.isSuccess || !officer?.id) return;
    if (["/login"].includes(router.pathname)) {
      router.push("/sponsors");
    }
  }, [getOfficerRequest.isLoading, getOfficerRequest.isSuccess]);

  // redirect to login if no user
  useEffect(() => {
    if (noUser) {
      router.push("/login");
    }
  }, [noUser]);

  const isLoading = auth.isLoading || getOfficerRequest.isLoading;
  return (
    <Provider
      value={{
        signIn,
        isLoading,
        signOut,
      }}
    >
      {isLoading ? <LoadingPage hideLogo={false} /> : children}
    </Provider>
  );
};

export default AuthProvider;

export function useAuth() {
  return useContext(authContext);
}
