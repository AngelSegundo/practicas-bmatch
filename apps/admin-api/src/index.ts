import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./infrastructure/firebase";
import {
  CountryRepositoryImpl,
  SponsorRepositoryImpl,
  CommunityRepositoryImpl,
  InvitationRepositoryImpl,
  OfficerRepositoryImpl,
} from "domain/repositories";
// todo: rearange imports
import CommunityController from "./controllers/communities";
import CountryController from "./controllers/countries";
import SponsorController from "./controllers/sponsors";
import OfficerController from "./controllers/officers";
import InvitationController from "./controllers/invitations";
import UserController from "./controllers/users";
import ServiceController from "./controllers/services";
import ServiceConnectionController from "./controllers/service-connections";
import ServiceReadingController from "./controllers/service-readings";
import RewardController from "./controllers/rewards";
import TipController from "./controllers/tips";
import GoalController from "./controllers/goals";
import InsightController from "./controllers/insights";

import sponsorsRouter from "./routes/sponsors";
import usersRouter from "./routes/users";
import communitiesRouter from "./routes/communities";
import countriesRouter from "./routes/countries";
import serviceConnectionsRouter from "./routes/service-connections";
import { FirestoreDatabase } from "./data/firestore";
import invitationsRouter from "./routes/invitations";
import officersRouter from "./routes/officers";
import tipsRouter from "./routes/tips";
import goalsRouter from "./routes/goals";
import insightsRouter from "./routes/insights";

import { DataSourceImpl } from "domain/interfaces";
import {
  CommunityDTO,
  COMMUNITY_TABLE_NAME,
  CountryDTO,
  COUNTRY_TABLE_NAME,
  InvitationDTO,
  INVITATION_TABLE_NAME,
  OfficerDTO,
  OFFICER_TABLE_NAME,
  SponsorDTO,
  SPONSOR_TABLE_NAME,
} from "domain/entities";
import servicesRouter from "./routes/services";
import { FileStorage } from "./data/file-storage";
import { useAuthenticationOfficer } from "./middlewares/useAuthenticationOfficer";
import { useLogger } from "./middlewares/useLogger";
import rewardsRouter from "./routes/rewards";
import serviceReadingRouter from "./routes/service-readings";
import { LoggingWinston } from "@google-cloud/logging-winston";
// import SwaggerUI from "swagger-ui-express";

dotenv.config({ path: ".env.local" });

const database: FirestoreDatabase = new FirestoreDatabase();
const storageService: FileStorage = new FileStorage();

const app: Express = express();
const port = process.env.PORT;

// ** Middlewares - Start **
// app.use(
//   "/docs",
//   SwaggerUI.serve,
//   SwaggerUI.setup(require("../dist/swagger.json"))
// );

console.log("ENV - FILES_BUCKET", process.env.FILES_BUCKET);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fileupload = require("express-fileupload");
app.use(fileupload());
const cloudLogger = new LoggingWinston();
console.log(process.env.ENV);
app.use(useLogger(process.env.ENV !== "local" ? cloudLogger : undefined));
app.use(useAuthenticationOfficer({ database }));

app.use(
  (error: any, request: Request, response: Response, next: NextFunction) => {
    // todo proper erro handling
    response.status(500).json({ message: "Unhandeled error" });
    next(error);
  }
);

// ** Middlewares - End **

// ** Handlers - Start **
const communitiesHandler = communitiesRouter({
  controller: new CommunityController(database, storageService),
});

const countriesHandler = countriesRouter({
  controller: new CountryController(
    new CountryRepositoryImpl(
      new DataSourceImpl<CountryDTO>(database, COUNTRY_TABLE_NAME)
    )
  ),
});

const sponsorsHandler = sponsorsRouter({
  controller: new SponsorController(
    new SponsorRepositoryImpl(
      new DataSourceImpl<SponsorDTO>(database, SPONSOR_TABLE_NAME)
    ),
    new CommunityRepositoryImpl(
      new DataSourceImpl<CommunityDTO>(database, COMMUNITY_TABLE_NAME)
    )
  ),
});

const invitationsHandler = invitationsRouter({
  controller: new InvitationController(
    new InvitationRepositoryImpl(
      new DataSourceImpl<InvitationDTO>(database, INVITATION_TABLE_NAME)
    )
  ),
});

const officersHandler = officersRouter({
  controller: new OfficerController(
    new OfficerRepositoryImpl(
      new DataSourceImpl<OfficerDTO>(database, OFFICER_TABLE_NAME)
    )
  ),
});

// la manera correcta es como los de abajo
const usersHandler = usersRouter({
  controller: new UserController(database, storageService),
});

const servicesHandler = servicesRouter({
  controller: new ServiceController(database, storageService),
});

const serviceConnectionsHandler = serviceConnectionsRouter({
  controller: new ServiceConnectionController(database),
});
const serviceReadingHandler = serviceReadingRouter({
  controller: new ServiceReadingController(database, storageService),
});

const rewardsHandler = rewardsRouter({
  controller: new RewardController(database, storageService),
});
const tipsHandler = tipsRouter({
  controller: new TipController(database, storageService),
});
const goalsHandler = goalsRouter({
  controller: new GoalController(database),
});
const insightsHandler = insightsRouter({
  controller: new InsightController(database),
});

// ** Handlers - End **

// ** Routes - Start **
app.use("/communities", communitiesHandler);
app.use("/countries", countriesHandler);
app.use("/sponsors", sponsorsHandler);
app.use("/invitations", invitationsHandler);
app.use("/officers", officersHandler);
app.use("/users", usersHandler);
app.use("/services", servicesHandler);
app.use("/service-connections", serviceConnectionsHandler);
app.use("/service-readings", serviceReadingHandler);
app.use("/rewards", rewardsHandler);
app.use("/tips", tipsHandler);
app.use("/goals", goalsHandler);
app.use("/insights", insightsHandler);

// ** Routes - End **
app.listen(port, () => {
  console.log(`[server]: Server is running ${process.env.PORT}`);
});
