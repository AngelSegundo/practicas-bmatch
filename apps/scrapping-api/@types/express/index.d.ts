import { UserDTO } from "domain/entities";
import { auth } from "firebase-admin";
import winston from "winston";

declare global {
  namespace Express {
    export interface Request {
      auth?: auth.DecodedIdToken;
      currentUser?: UserDTO;
      log: winston.Logger;
      files: { [fieldname: string]: {
        mimeType: string;
        size: number;
        name: string;
        data: Buffer;
      } };
    }
  }
}
