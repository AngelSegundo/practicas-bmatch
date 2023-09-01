import { OfficerDTO, OFFICER_TABLE_NAME } from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import { OfficerRepositoryImpl } from "domain/repositories";
import { NextFunction, Request, RequestHandler, Response } from "express";
// import { AppHandler, AppRequest } from "../infrastructure/express";
import { firebaseApp } from "../infrastructure/firebase";

const auth = firebaseApp.auth();

export interface useAuthenticationOfficerProps {
  database: Database;
}

export const useAuthenticationOfficer: (
  props: useAuthenticationOfficerProps
) => RequestHandler = (props) => {
  const repository = new OfficerRepositoryImpl(
    new DataSourceImpl<OfficerDTO>(props.database, OFFICER_TABLE_NAME)
  );
  return async (request: Request, response: Response, next: NextFunction) => {
    const bearer = request.headers.authorization;

    if (!bearer) {
      // todo: pass to domain
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const [, token] = bearer.split(" ");
      const decodedToken = await auth.verifyIdToken(token);

      request.auth = decodedToken;
      const currentOfficer = await repository.getOfficerById(decodedToken.uid);
      request.log.info(`Authenticated as ${currentOfficer.id}`);
      request.currentOfficer = currentOfficer;
      next();
    } catch (error) {
      // todo: pass to domain error
      response.status(401).json({ message: "Error decoding token" });
    }
  };
};
