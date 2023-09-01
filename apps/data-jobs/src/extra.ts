import dotenv from "dotenv";
import { BigQuery } from "@google-cloud/bigquery";
import { Firestore } from "@google-cloud/firestore";
import zod from "zod";
import {
  SponsorDTOSchema,
} from "domain/entities";
import { convert } from "./utils/zodToBigQuery";
import { deleteAllRows } from "./utils/bigQuery";

dotenv.config({ path: ".env.local" });

const BigQueryRecord = zod.object({
  operation: zod.enum(["IMPORT", "INSERT", "UPDATE", "DELETE"]),
  timestamp: zod.string().datetime(),
});

const DATASET_ID = "firestore";
// dataset must be created befeorehand

// Create a new clients
const firestore = new Firestore();

const tableSchemaMap = {
  sponsors: SponsorDTOSchema.merge(BigQueryRecord),
};

type collectionKeys = keyof typeof tableSchemaMap;

const firestoreToBigQuery = async (collections: collectionKeys[]) => {
  for await (const collection of collections) {
    const bigQuery = new BigQuery({ location: "EU", projectId: "bmatch-dev" });
    console.log("collection", collection);
    const tableSchema = tableSchemaMap[collection];
    const table = bigQuery
      .dataset(DATASET_ID, { location: "EU", projectId: "bmatch-dev" })
      .table(collection);
    const tableExists = await table.exists();
    if (tableExists[0]) {
      // delete al items in table
      await deleteAllRows({
        datasetId: DATASET_ID,
        tableId: collection,
        projectId: "bmatch-dev",
      });
    } else {
      await table.create({
        location: "EU",
        schema: convert(tableSchema),
      });
    }
    const querySnapshot = await firestore.collection(collection).get();
    // warning: this is not strictly typed
    const rows = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return tableSchema.parse({
        ...data,
        timestamp: new Date().toISOString(),
        operation: "IMPORT",
      });
    });
    await table.insert(rows);
  }
};

const main = async () => {
  // create dataset if doesn't exist
  const bigQuery = new BigQuery({ location: "EU" });
  const [dataset] = await bigQuery
    .dataset(DATASET_ID, { location: "EU" })
    .get({ autoCreate: true });
  console.log(`Dataset ${dataset.id} created.`);
  await firestoreToBigQuery(["sponsors"]);
};

main().catch((error) => {
  console.error(JSON.stringify(error));
});
