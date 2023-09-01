import {
    MiningInput,
    ServiceConnectionDTO,
    ServiceReading,
  } from "domain/entities";
  import textOperationMiner from "../utils/textOperationsMiner";
  import { ticketOps } from "./metrogas.ops";
  import { FileStorage } from "../data/file-storage";
  import { getServiceTypeUnit } from "domain/utilities";
  import { parseDate } from "../utils/dateParser";
  
  const storage = new FileStorage();
  
  export const metrogasHandler = async ({
    input: { serviceConnectionId, serviceKey, serviceType, year, month },
    connection,
  }: {
    input: MiningInput;
    connection: ServiceConnectionDTO;
  }): Promise<ServiceReading> => {
    const file = await storage.downloadFile({
      bucket: process.env.BUCKET_NAME as string,
      path: `${serviceType}/${serviceKey}/${serviceConnectionId}/${year}/${month}/data.txt`,
    });
  
    const dataText = file.toString() as string;
  
    const data = textOperationMiner(dataText, ticketOps);
    console.log(data);
    
    if (!data.user_consumption) throw new Error("No data found");
  
    const [, , day] = data.issued_date.split("-");
  
    const value = data.user_consumption.replace(",", ".");
  
    const serviceReading: ServiceReading = {
      serviceId: connection.serviceId,
      serviceConnectionId,
      userId: connection.userId,
      value: parseFloat(value),
      unit: getServiceTypeUnit(connection.type),
      readingDate: parseDate(`${day ?? "01"}/${month}/${year}`),
      month,
      year,
      type: connection.type,
    };
  
    return serviceReading;
  };
  