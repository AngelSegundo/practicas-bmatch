import "./infrastructure/firebase";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Router from "./router"

/* import Router from "./router";
import { useLogger } from "./middlewares/useLogger";
import { useLogMetrics } from "./middlewares/useLogMetrics"; */

dotenv.config({ path: ".env.local" });

const app = express();
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
/* app.use(useLogger());
app.use(useLogMetrics()); */

app.use(
  (
    error: unknown,
    request: Request,
    response: any,
    next: any
  ) => {
    // todo proper error handling
    response.status(500).json({ message: "Unhandeled error" });
    next(error);
  }
);

// ** Middlewares - End **

const handler = Router();

app.use("/api", handler);
app.use("/", (req:any, res:any) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running`);
  console.log(`[server]: GCP Project: ${process.env.GOOGLE_CLOUD_PROJECT}`);
});
