import { log } from "console";
import { NextFunction, Request, RequestHandler, Response } from "express";

// todo to enable no user
export const useAuthentication: () => RequestHandler = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const bearer = request.headers.authorization;
    if (!bearer) {
      // todo: pass to domain
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    const [, token] = bearer.split(" ");

    if (token !== process.env.AUTHORIZATION_TOKEN) {
      // todo: domain error;
      console.log(process.env.AUTHORIZATION_TOKEN);
      response.status(401).json({ message: "Error decoding token" });
      return;
    }

    next();
  };
};
