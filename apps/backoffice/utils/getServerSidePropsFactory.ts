import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { auth } from "./firebaseAdmin";

export default function getServerSidePropsFactory(
  localesToLoad: string[],
  authenticated?: boolean
): GetServerSideProps {
  return async ({ locale, req, res }) => {
    const pathname = req.url;
    if (pathname?.includes("/complete-sign-in")) {
      return {
        props: {
          ...(await serverSideTranslations(locale ?? "", localesToLoad)),
        },
      };
    }

    let uid = null;
    if (typeof authenticated === "boolean" && !authenticated) {
      const authorization = req.headers.Authorization;
      if (typeof authorization !== "string") {
        console.log("No authorization header");
        return {
          props: {
            ...(await serverSideTranslations(locale ?? "", localesToLoad)),
            redirect: {
              destination: "/login",
              permanent: false,
            },
          },
        };
      }

      const [, token] = authorization.split(" ");
      try {
        const authData = await auth.verifyIdToken(token);
        console.log("authData", authData);
        uid = authData.uid;
      } catch (error) {
        return {
          props: {
            ...(await serverSideTranslations(locale ?? "", localesToLoad)),
            redirect: {
              destination: "/login",
              permanent: false,
            },
          },
        };
      }
    }
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "", localesToLoad)),
        uid,
      },
    };
  };
}
