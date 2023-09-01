import { MiningInput } from "domain/entities";
import getPDFText from "../utils/getPDFText";
import textOperationMiner from "../utils/textOperationsMiner";
import { ticketOps } from "./essal.ops";

export const essalHandler = async ({
  serviceConnectionId,
  serviceKey,
  serviceType,
  year,
  month,
}: MiningInput) => {
  const fileText = await getPDFText({
    bucket: process.env.BUCKET_NAME as string,
    filePath: `${serviceType}/${serviceKey}/${serviceConnectionId}/${year}/${month}/data.pdf`,
    tolerance: 3,
  });

  console.log(fileText);

  const data = textOperationMiner(fileText, ticketOps);

  return data;
};
