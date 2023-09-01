import dotenv from "dotenv";
import "./firebase";

import {
  BmatchScrappingServices,
  BmatchMiningServices,
  FirestoreDatabase,
  createLogger,
} from "shared/services";
import {
  GetServiceConnectionNewReadingsImpl,
  GetServiceConnectionsByUserIdUseCaseImpl,
} from "domain/useCases";
import { ServiceConnectionRepositoryImpl } from "domain/repositories";
import { DataSourceImpl } from "domain/interfaces";
import {
  ServiceConnectionDTO,
  SERVICE_CONNECTION_TABLE_NAME,
} from "domain/entities";

dotenv.config({ path: ".env.local" });

// Retrieve Job-defined env vars
const { CLOUD_RUN_TASK_INDEX = "0" } = process.env;
// Retrieve User-defined env vars
const { USER_IDS = "" } = process.env;

// Create a new clients
const database: FirestoreDatabase = new FirestoreDatabase();
const dataSource = new DataSourceImpl<ServiceConnectionDTO>(
  database,
  SERVICE_CONNECTION_TABLE_NAME
);

const scrapperService = new BmatchScrappingServices({
  url: process.env.SCRAPPER_API_URL as string,
});
const miningService = new BmatchMiningServices({
  url: process.env.MINER_API_URL as string,
});

const serviceConnectionRepository = new ServiceConnectionRepositoryImpl(
  dataSource
);

const logger = createLogger({ useCloud: !(process.env.ENV === "dev") });

const main = async () => {
  if (USER_IDS.length === 0) {
    throw new Error("No user ids provided");
  }

  const jobIndex = parseInt(CLOUD_RUN_TASK_INDEX);
  const userList = USER_IDS.split(",");

  const userId = userList[jobIndex] satisfies string;

  // const get user service connections
  const getServiceConnections = new GetServiceConnectionsByUserIdUseCaseImpl(
    serviceConnectionRepository
  );
  const serviceConnections = await getServiceConnections.execute(userId);

  const getServiceConnectionNewReadings =
    new GetServiceConnectionNewReadingsImpl({
      serviceConnectionRepository,
      miningService,
      scrapperService,
    });

  // scrap and mine data for each service connection
  for await (const serviceConnection of serviceConnections) {
    const readings = await getServiceConnectionNewReadings.execute({
      serviceConnectionId: serviceConnection.id,
    });
    // log with severity level INFO

    logger.info(`Readings for ${serviceConnection.id}: ${readings.length}`);
  }

  logger.info(
    `Updated ${serviceConnections.length} service connections for user ${userId}`
  );
};

main().catch((error) => {
  logger.error(JSON.stringify(error));
});
