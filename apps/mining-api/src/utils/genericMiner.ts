import {
  MiningInput,
  ServiceConnectionDTO,
  ServiceReading,
} from "domain/entities";
import { getServiceTypeUnit } from "domain/utilities";
import { MiningFieldOperation } from "../interfaces/MiningFieldOperation";
import { parseDate } from "./dateParser";
import { mineText } from "./minerBase";

export const genericMiner = async ({
  input,
  connection,
  operations,
}: {
  input: MiningInput;
  connection: ServiceConnectionDTO;
  operations: MiningFieldOperation[];
}): Promise<ServiceReading> => {
  const { serviceConnectionId, year, month } = input;

  const data = await mineText({
    input,
    operations,
  });

  if (!data.user_consumption) throw new Error("No data found");

  const value = data.user_consumption.replace(",", ".");

  const serviceReading: ServiceReading = {
    serviceId: connection.serviceId,
    serviceConnectionId,
    userId: connection.userId,
    value: parseFloat(value),
    unit: getServiceTypeUnit(connection.type),
    readingDate: parseDate(`01/${month}/${year}`),
    month,
    year,
    type: connection.type,
  };

  return serviceReading;
};
