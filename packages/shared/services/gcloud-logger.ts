import wiston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

export const createLogger = ({ useCloud = true }) => {
  if (!useCloud) {
    return wiston.createLogger({
      level: "info",
      transports: [
        new wiston.transports.Console({
          level: "debug",
          format: wiston.format.combine(
            wiston.format.simple(),
            wiston.format.colorize({ all: true })
          ),
        }),
      ],
    });
  }

  const cloudLogger = new LoggingWinston();
  return wiston.createLogger({
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
};
