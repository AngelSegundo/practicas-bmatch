import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import dotenv from "dotenv";

console.log("[server]: Initializing Firebase Admin SDK...");
dotenv.config({ path: ".env.local" });

export const firebaseApp = admin.initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FILES_BUCKET,
});
console.log(
  "[server]: Initializing Firebase project " + process.env.FIREBASE_PROJECT_ID
);
console.log("[server]: FILES_BUCKET" + process.env.FILES_BUCKET);
