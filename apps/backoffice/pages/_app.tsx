import { ReactElement, useEffect, useState } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/root";
import "../styles/global.css";
import "../firebase";
import { useRouter } from "next/router";
import AlertProvider from "../contexts/AlertContext";
import { LoadingPage } from "ui";
import AuthProvider from "../contexts/AuthContext";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onRouteChangeStart = () => {
    setIsLoading(true);
  };

  const onRouteChangeEnd = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeEnd);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeEnd);
    };
  }, []);

  const getLayout = Component.getLayout ?? ((page: JSX.Element) => page);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {isLoading && <LoadingPage hideLogo={false} />}
        {!isLoading && router.pathname === "/complete-sign-in" ? (
          getLayout(<Component {...pageProps} />)
        ) : (
          <AuthProvider>
            <AlertProvider>
              {getLayout(<Component {...pageProps} />)}
            </AlertProvider>
          </AuthProvider>
        )}
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
