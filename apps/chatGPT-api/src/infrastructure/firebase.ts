import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

console.log("[server]: Initializing Firebase Admin SDK...");
export const firebaseApp = admin.initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: "https://bmatch-dev.firebaseio.com",
});
console.log("[server]: Initialized");
