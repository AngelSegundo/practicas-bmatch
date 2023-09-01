import { MiningInput, ScrapData } from "domain/entities";
import { MiningFieldOperation } from "../interfaces/MiningFieldOperation";
import getPDFText from "./getPDFText";
import textOperationMiner from "./textOperationsMiner";

export const mineText = async ({
  input,
  operations,
}: {
  input: MiningInput;
  operations: MiningFieldOperation[];
}): Promise<ScrapData> => {
  const { serviceConnectionId, serviceKey, serviceType, year, month } = input;
  const fileText = await getPDFText({
    bucket: process.env.BUCKET_NAME as string,
    filePath: `${serviceType}/${serviceKey}/${serviceConnectionId}/${year}/${month}/data.pdf`,
    tolerance: 3,
  });

  const data = textOperationMiner(fileText, operations);
  return data;
};
