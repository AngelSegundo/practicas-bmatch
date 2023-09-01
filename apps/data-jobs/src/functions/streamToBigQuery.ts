import { BigQuery } from "@google-cloud/bigquery";
import { EventContext, FirestoreDocument, FirestoreEvent } from "../types";
import {
  getOperationType,
  mapFirestoreDocumentToObject,
} from "../utils/cloudUtils";

const DATASET_ID = "firestore";
const ALLOWED_COLLECTIONS = [
  "readings",
  "users",
  "communities",
  "connections",
  "services",
  "sponsors",
];
// dataset must be created befeorehand
const bigQuery = new BigQuery();

export const streamToBigQuery = async (
  event: FirestoreEvent,
  context: EventContext<{ collectionId: string; documentId: string }>
) => {
  console.log(`Context: ${JSON.stringify(context)}`);
  console.log(`Event: ${JSON.stringify(event)}`);

  const collectionId = context.params.collectionId;
  console.log(`Collection ID: ${collectionId}`);

  const documentId = context.params.documentId;
  console.log(`Document ID: ${documentId}`);

  if (!ALLOWED_COLLECTIONS.includes(collectionId)) {
    console.log("Collection not allowed, skiping...");
    return;
  }

  const operationType = getOperationType(event);
  console.log(`Operation type: ${operationType}`);

  const newValue = event.value?.fields
    ? mapFirestoreDocumentToObject(event.value as FirestoreDocument)
    : null;
  console.log(`New value: ${JSON.stringify(newValue)}`);

  const oldValue = event.oldValue?.fields
    ? mapFirestoreDocumentToObject(event.oldValue as FirestoreDocument)
    : null;
  console.log(`Old value: ${JSON.stringify(oldValue)}`);

  const table = bigQuery.dataset(DATASET_ID).table(collectionId);

  const tableExists = await table.exists();

  if (!tableExists[0]) {
    // throw error if table doesn't exist
    throw new Error(`Table ${collectionId} doesn't exist`);
  }

  if (operationType === "INSERT") {
    await table.insert({
      ...newValue,
      timestamp: new Date().toISOString(),
      operation: operationType,
    });
  } else if (operationType === "UPDATE") {
    await table.insert({
      ...newValue,
      timestamp: new Date().toISOString(),
      operation: operationType,
    });
  } else if (operationType === "DELETE") {
    await table.insert({
      ...oldValue,
      timestamp: new Date().toISOString(),
      operation: operationType,
    });
  }

  return;
};
