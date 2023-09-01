import { UserDTO, USER_TABLE_NAME } from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import { UserRepositoryImpl } from "domain/repositories";
import { NextFunction, Request, RequestHandler, Response } from "express";

export interface useCurrentUserProps {
  database: Database;
}

export const useCurrentUser: (props: useCurrentUserProps) => RequestHandler = (
  props
) => {
  const repository = new UserRepositoryImpl(
    new DataSourceImpl<UserDTO>(props.database, USER_TABLE_NAME)
  );

  return async (request: Request, response: Response, next: NextFunction) => {
    const authToken = request.auth;

    if (!authToken) {
      // todo: domain error
      response.status(401).json({
        message:
          "Unauthorized - attempt to get current user with no Authorization header",
      });
      return;
    }

    try {
      const currentUser = await repository.getUserById(authToken.uid);
      request.log.info(`Authenticated as ${currentUser.id}`);
      request.currentUser = currentUser;
    } catch (error) {
      // todo: pass to domain error
      response.status(401).json({ message: "Error fetching current user" });
      return;
    }
    next();
  };
};
