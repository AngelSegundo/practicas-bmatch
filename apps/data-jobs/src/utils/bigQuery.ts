import { BigQuery } from "@google-cloud/bigquery";

export const deleteAllRows = async ({
  datasetId,
  tableId,
  projectId,
}: {
  datasetId: string;
  tableId: string;
  projectId: string;
}) => {
  const sqlQuery = `DELETE FROM ${datasetId}.${tableId} WHERE true;`;

  const bigquery = new BigQuery({ projectId });

  // Query options list: https://cloud.google.com/bigquery/docs/reference/v2/jobs/query
  const options = {
    query: sqlQuery,
    timeoutMs: 100000, // Time out after 100 seconds.
    useLegacySql: false, // Use standard SQL syntax for queries.
  };

  // Runs the query
  await bigquery.query(options);
};
