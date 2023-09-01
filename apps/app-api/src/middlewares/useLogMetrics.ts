import { NextFunction, Request, RequestHandler, Response } from "express";

export const useLogMetrics: () => RequestHandler = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    const logger = request.log;

    logger.debug(
      `metrics -> method: ${request.method} ${
        request.url
      } - user-agent: ${JSON.stringify(request.headers["user-agent"])} IP: ${
        request.ip
      } `
    );
    next();
  };
};
