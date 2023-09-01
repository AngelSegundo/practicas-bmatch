import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./infrastructure/firebase";
import { FirestoreDatabase } from "./data/firestore";
import { FileStorage } from "./data/file-storage";

import CommunityController from "./controllers/communities";
import UserController from "./controllers/users";

import communitiesRouter from "./routes/communities";
import usersRouter from "./routes/users";

import { useLogger } from "./middlewares/useLogger";
import { useAuthentication } from "./middlewares/useAuthentication";
import { useLogMetrics } from "./middlewares/useLogMetrics";

import { DataSourceImpl } from "domain/interfaces";
import {
  ServiceConnectionDTO,
  SERVICE_CONNECTION_TABLE_NAME,
} from "domain/entities";
import {
  BmatchMiningServices,
  BmatchScrappingServices,
  createLogger,
  GoogleChatMessageService,
} from "shared/services";
import { Firestore } from "@google-cloud/firestore";
import { ServiceConnectionRepositoryImpl } from "domain/repositories";
import {
  GetServiceConnectionNewReadingsImpl,
  GetServiceConnectionsByUserIdUseCaseImpl,
} from "domain/useCases";
import { error, log } from "console";

dotenv.config({ path: ".env.local" });

const database: FirestoreDatabase = new FirestoreDatabase();
const storageService: FileStorage = new FileStorage();

const app: Express = express();
const port = process.env.PORT;

// ** Middlewares - Start **

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fileupload = require("express-fileupload");
app.use(fileupload());
app.use(useLogger());
app.use(useLogMetrics());

app.use(
  (
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    // todo proper error handling
    response.status(500).json({ message: "Unhandeled error" });
    next(error);
  }
);

const useAuthenticationMW = useAuthentication();
app.use(useAuthenticationMW);
// ** Middlewares - End **

// Create a new clients
const DATASET_ID = "users";
const dataSource = new DataSourceImpl<ServiceConnectionDTO>(
  database,
  SERVICE_CONNECTION_TABLE_NAME
);

const logger = createLogger({ useCloud: !(process.env.ENV === "dev-dev") });

const googleChatService = new GoogleChatMessageService({
  key: process.env.GOOGLE_CHAT_MESSAGE_SERVICE_KEY as string,
  token: process.env.GOOGLE_CHAT_MESSAGE_SERVICE_TOKEN as string,
});

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
    } catch (error) {
      console.log("Error");
    }
  }

  response.json({ serviceConnections });
});

// ** Handlers - Start **
const communitiesHandler = communitiesRouter({
  controller: new CommunityController(database, storageService),
});

const usersHandler = usersRouter({
  controller: new UserController(database, storageService),
});
// ** Handlers - End **

// ** Routes - Start **
app.use("/communities", communitiesHandler);
app.use("/users", usersHandler);
// ** Routes - End **

app.get("/", (request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running`);
  console.log(`[server]: Listening on port ${port}`);
  console.log(`[server]: GCP Project: ${process.env.GOOGLE_CLOUD_PROJECT}`);
  console.log(`[server]: Mining API URL ${process.env.MINER_API_URL}`);
  console.log(`[server]: Scrapping API URL ${process.env.SCRAPPER_API_URL}`);
  console.log(`batch services listening at: ${port}`);
  console.log(process.env.AUTHORIZATION_TOKEN);
});
