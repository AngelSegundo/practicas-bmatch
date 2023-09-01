import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./infrastructure/firebase";
import { FirestoreDatabase } from "./data/firestore";
import { FileStorage } from "./data/file-storage";
import CommunityController from "./controllers/communities";
import CountryController from "./controllers/countries";
import IaController from "./controllers/ia";
import SponsorController from "./controllers/sponsors";
import InvitationController from "./controllers/invitations";
import UserController from "./controllers/users";
import ServiceController from "./controllers/services";
import ServiceConnectionController from "./controllers/service-connections";
import RewardController from "./controllers/rewards";
import TipController from "./controllers/tips";
import GoalController from "./controllers/goals";
import InsightController from "./controllers/insights";
import sponsorsRouter from "./routes/sponsors";
import usersRouter from "./routes/users";
import communitiesRouter from "./routes/communities";
import countriesRouter from "./routes/countries";
import serviceConnectionsRouter from "./routes/service-connections";
import invitationsRouter from "./routes/invitations";
import servicesRouter from "./routes/services";
import iaRouter from "./routes/ia";
import rewardsRouter from "./routes/rewards";
import tipsRouter from "./routes/tips";
import goalsRouter from "./routes/goals";
import insightsRouter from "./routes/insights";
import rankingsRouter from "./routes/rankings";
import { useLogger } from "./middlewares/useLogger";
import { useAuthentication } from "./middlewares/useAuthentication";
import { useCurrentUser } from "./middlewares/useCurrentUser";
import { useLogMetrics } from "./middlewares/useLogMetrics";
import { FirebaseAuthProvider } from "./services/firebase-auth";
import RankingController from "./controllers/rankings";

dotenv.config({ path: ".env.local" });

const database: FirestoreDatabase = new FirestoreDatabase();
const storageService: FileStorage = new FileStorage();
const authService = new FirebaseAuthProvider();

const app: Express = express();
const port = process.env.PORT;

// ** Middlewares - Start **
// app.use(
//   "/docs",
//   swaggerUi.serve,
//   swaggerUi.setup(require("../dist/swagger.json"))
// );

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
const useCurrentUserMW = useCurrentUser({ database });

// ** Middlewares - End **

// ** Handlers - Start **
const countriesHandler = countriesRouter({
  controller: new CountryController(database),
});

const invitationsHandler = invitationsRouter({
  controller: new InvitationController(database),
});

const iaHandler = iaRouter({
  controller: new IaController(database, storageService)
});

const communitiesHandler = communitiesRouter({
  controller: new CommunityController(database, storageService),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});

const sponsorsHandler = sponsorsRouter({
  controller: new SponsorController(database),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});

const usersHandler = usersRouter({
  controller: new UserController(database, storageService),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
  authProvider: authService,
});

const servicesHandler = servicesRouter({
  controller: new ServiceController(database, storageService),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});

const serviceConnectionsHandler = serviceConnectionsRouter({
  controller: new ServiceConnectionController(database, storageService),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});
const rewardsHandler = rewardsRouter({
  controller: new RewardController(database, storageService),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});
const tipsHandler = tipsRouter({
  controller: new TipController(database, storageService),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});
const goalsHandler = goalsRouter({
  controller: new GoalController(database),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});
const insightsHandler = insightsRouter({
  controller: new InsightController(database),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});
const rankingsHandler = rankingsRouter({
  controller: new RankingController(database),
  useAuthenticationMW: useAuthenticationMW,
  useCurrentUserMW: useCurrentUserMW,
});

// ** Handlers - End **

// ** Routes - Start **
app.use("/communities", communitiesHandler);
app.use("/countries", countriesHandler);
app.use("/sponsors", sponsorsHandler);
app.use("/invitations", invitationsHandler);
app.use("/users", usersHandler);
app.use("/services", servicesHandler);
app.use("/service-connections", serviceConnectionsHandler);
app.use("/rewards", rewardsHandler);
app.use("/tips", tipsHandler);
app.use("/goals", goalsHandler);
app.use("/insights", insightsHandler);
app.use("/rankings", rankingsHandler);
app.use("/ia", iaHandler);


// ** Routes - End **

app.listen(port, () => {
  console.log(`[server]: Server is running ${process.env.PORT}`);
  console.log(`[server]: Listening on port ${port}`);
  console.log(`[server]: GCP Project: ${process.env.GOOGLE_CLOUD_PROJECT}`);
  console.log(`[server]: Mining API URL ${process.env.MINER_API_URL}`);
  console.log(`[server]: Scrapping API URL ${process.env.SCRAPPER_API_URL}`);
});
