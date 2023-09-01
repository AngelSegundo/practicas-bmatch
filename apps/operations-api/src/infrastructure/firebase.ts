import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

console.log("[server]: Initializing Firebase Admin SDK...");
export const firebaseApp = admin.initializeApp({
  credential: applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  databaseURL: "https://bmatch-dev.firebaseio.com",
});
