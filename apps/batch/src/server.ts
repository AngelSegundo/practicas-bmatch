import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import "./firebase";

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

import { Firestore } from "@google-cloud/firestore";
import {
  BmatchMiningServices,
  BmatchScrappingServices,
  createLogger,
  FirestoreDatabase,
  GoogleChatMessageService,
} from "shared/services";

const DATASET_ID = "users";

// Create a new clients
const database: FirestoreDatabase = new FirestoreDatabase();
const dataSource = new DataSourceImpl<ServiceConnectionDTO>(
  database,
  SERVICE_CONNECTION_TABLE_NAME
);

const logger = createLogger({ useCloud: !(process.env.ENV === "dev") });

const app: Express = express();
const port = process.env.PORT;

const googleChatService = new GoogleChatMessageService({
  key: process.env.GOOGLE_CHAT_MESSAGE_SERVICE_KEY as string,
  token: process.env.GOOGLE_CHAT_MESSAGE_SERVICE_TOKEN as string,
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/user-batches", async (request, response) => {
  console.log("getUsersBatches called");
  const firestore = new Firestore({
    projectId: process.env.GCP_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  // get all users
  const usersQuery = await firestore.collection(DATASET_ID).get();
  const users = usersQuery.docs.map((doc) => doc.id);

  response.json({ users });
});

app.post("/batch", async (request, response) => {
  const { userId } = request.body;
  console.log("batch called: ", userId);

  const serviceConnectionRepository = new ServiceConnectionRepositoryImpl(
    dataSource
  );

  // const get user service connections
  const getServiceConnections = new GetServiceConnectionsByUserIdUseCaseImpl(
    serviceConnectionRepository
  );
  const serviceConnections = await getServiceConnections.execute(userId);

  const scrapperService = new BmatchScrappingServices({
    url: process.env.SCRAPPER_API_URL as string,
  });
  const miningService = new BmatchMiningServices({
    url: process.env.MINER_API_URL as string,
  });

  const getServiceConnectionNewReadings =
    new GetServiceConnectionNewReadingsImpl({
      serviceConnectionRepository,
      miningService,
      scrapperService,
    });

  // scrap and mine data for each service connection
  for await (const serviceConnection of serviceConnections) {
    try {
      const readings = await getServiceConnectionNewReadings.execute({
        serviceConnectionId: serviceConnection.id,
      });
      logger.info(`Readings for ${serviceConnection.id}: ${readings.length}`);
      await googleChatService.updateServiceConnectionMessage({
        userId: serviceConnection.userId,
        serviceConnectionId: serviceConnection.id,
        serviceName: serviceConnection.serviceKey as string,
        config: serviceConnection.config,
        source: "batch",
        result: "success",
      });
    } catch (error) {
      logger.error(`Error getting readings for ${serviceConnection.id}`);
      await googleChatService.updateServiceConnectionMessage({
        userId: serviceConnection.userId,
        serviceConnectionId: serviceConnection.id,
        serviceName: serviceConnection.serviceKey as string,
        config: serviceConnection.config,
        source: "batch",
        result: "error",
      });
    }
    // log with severity level INFO
  }

  logger.info(
    `Updated ${serviceConnections.length} service connections for user ${userId}`
  );

  response.json({ serviceConnections });
});

app.get("/", (request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`batch services listening at: ${port}`);
});
