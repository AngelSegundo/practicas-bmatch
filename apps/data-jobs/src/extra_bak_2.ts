import { BigQuery } from "@google-cloud/bigquery";
import { EventContext, FirestoreDocument, FirestoreEvent } from "./types";
import {
  getOperationType,
  mapFirestoreDocumentToObject,
} from "./utils/cloudUtils";

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

streamToBigQuery(
  {
    oldValue: {
      createTime: "2022-11-11T09:47:05.031751Z",
      fields: {
        billingAddress: {
          mapValue: {
            fields: {
              city: { stringValue: "Santiago de Chile" },
              countryId: { stringValue: "chile" },
              location: { stringValue: "Santiago de Chile" },
              postalCode: { stringValue: "28080" },
              province: { stringValue: "Chile" },
              streetName: { stringValue: "Calle Coslada 6" },
            },
          },
        },
        commercialName: { stringValue: "Bmatch" },
        countryId: { stringValue: "chile" },
        createdAt: { stringValue: "2022-11-11T09:47:04.872Z" },
        id: { stringValue: "spo_2HOdNeyImxtQIcvoVwrgt6WSYHx" },
        legalName: { stringValue: "Bmatch" },
        manager: {
          mapValue: {
            fields: {
              email: { stringValue: "nicolle@bmatch.cl" },
              firstName: { stringValue: "Nicolle de Bmatch" },
              lastName: { stringValue: "Nicolle" },
              phone: { stringValue: "661661661" },
            },
          },
        },
        taxId: { stringValue: "123-321" },
        updatedAt: { stringValue: "2023-01-25T14:00:35.343Z" },
      },
      name: "projects/bmatch-dev/databases/(default)/documents/sponsors/spo_2HOdNeyImxtQIcvoVwrgt6WSYHx",
      updateTime: "2023-01-30T11:26:12.211215Z",
    },
    updateMask: { fieldPaths: ["manager.phone"] },
    value: {
      createTime: "2022-11-11T09:47:05.031751Z",
      fields: {
        billingAddress: {
          mapValue: {
            fields: {
              city: { stringValue: "Santiago de Chile" },
              countryId: { stringValue: "chile" },
              location: { stringValue: "Santiago de Chile" },
              postalCode: { stringValue: "28080" },
              province: { stringValue: "Chile" },
              streetName: { stringValue: "Calle Coslada 6" },
            },
          },
        },
        commercialName: { stringValue: "Bmatch" },
        countryId: { stringValue: "chile" },
        createdAt: { stringValue: "2022-11-11T09:47:04.872Z" },
        id: { stringValue: "spo_2HOdNeyImxtQIcvoVwrgt6WSYHx" },
        legalName: { stringValue: "Bmatch" },
        manager: {
          mapValue: {
            fields: {
              email: { stringValue: "nicolle@bmatch.cl" },
              firstName: { stringValue: "Nicolle de Bmatch" },
              lastName: { stringValue: "Nicolle" },
              phone: { stringValue: "12341234" },
            },
          },
        },
        taxId: { stringValue: "123-321" },
        updatedAt: { stringValue: "2023-01-25T14:00:35.343Z" },
      },
      name: "projects/bmatch-dev/databases/(default)/documents/sponsors/spo_2HOdNeyImxtQIcvoVwrgt6WSYHx",
      updateTime: "2023-01-30T11:47:27.163727Z",
    },
  },
  {
    eventId: "4df9c3ba-abf7-43cb-9aa8-9ac13cf7f94c-0",
    eventType: "providers/cloud.firestore/eventTypes/document.write",
    notSupported: {},
    params: {
      collectionId: "sponsors",
      documentId: "spo_2HOdNeyImxtQIcvoVwrgt6WSYHx",
    },
    resource:
      "projects/bmatch-dev/databases/(default)/documents/sponsors/spo_2HOdNeyImxtQIcvoVwrgt6WSYHx",
    timestamp: "2023-01-30T11:47:27.163727Z",
  }
);
