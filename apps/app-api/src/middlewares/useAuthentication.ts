import { NextFunction, Request, RequestHandler, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { firebaseApp } from "../infrastructure/firebase";

const auth = firebaseApp.auth();

// todo to enable no user
export const useAuthentication: () => RequestHandler = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const bearer = request.headers.authorization;
    if (!bearer) {
      // todo: pass to domain
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    let decodedToken: DecodedIdToken | null = null;
    try {
      const [, token] = bearer.split(" ");
      decodedToken = await auth.verifyIdToken(token);
      request.auth = decodedToken;
    } catch (error) {
      // todo: pass to domain error
      console.log(error);
      response
        .status(401)
        .json({ message: "Error decoding token - Incorrect auth" });
      return;
    }

    if (decodedToken === null) {
      // todo: domain error;
      response.status(401).json({ message: "Token is null error" });
      return;
    }

    next();
  };
};
