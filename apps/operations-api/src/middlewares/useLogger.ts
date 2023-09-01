import wiston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import { NextFunction, Request, RequestHandler, Response } from "express";

const cloudLogger = new LoggingWinston();

const logger = wiston.createLogger({
  level: "info",
  transports: [
    new wiston.transports.Console({
      level: "debug",
      format: wiston.format.combine(
        wiston.format.simple(),
        wiston.format.colorize({ all: true })
      ),
    }),
    cloudLogger,
  ],
});

export const useLogger: () => RequestHandler = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    request.log = logger;
    next();
  };
};
