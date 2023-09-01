import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

console.log("[server]: Initializing Firebase Admin SDK...");
console.log("[server]: Firebase project" + process.env.GOOGLE_CLOUD_PROJECT);
export const firebaseApp = admin.initializeApp({
  credential: applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  databaseURL: "https://bmatch-dev.firebaseio.com",
});
