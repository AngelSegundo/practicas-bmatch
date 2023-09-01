import { OfficerDTO } from "domain/entities";
import { auth } from "firebase-admin";
import winston from "winston";

declare global {
  namespace Express {
    export interface Request {
      auth?: auth.DecodedIdToken;
      currentOfficer?: OfficerDTO;
      log: winston.Logger;
    }
  }
}
