import {
  MiningInput,
  ServiceConnectionDTO,
  ServiceReading,
} from "domain/entities";
import { getServiceTypeUnit } from "domain/utilities";
import { MiningFieldOperation } from "../interfaces/MiningFieldOperation";
import { parseDate } from "../utils/dateParser";
import { mineText } from "../utils/minerBase";

const kWh_PRICE = 110;

export const enelCLMiner = async ({
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

  data.issued_date = "";

  if (!data.user_consumption) {
    data.total_amount = data.total_amount.split("\n")[0];
    data.user_consumption = `${
      +data.total_amount.replace(".", "") / kWh_PRICE
    }}`;
  }

  const value = data.user_consumption.replace(",", ".");

  const serviceReading: ServiceReading = {
    serviceId: connection.serviceId,
    serviceConnectionId,
    userId: connection.userId,
    value: parseInt(value),
    unit: getServiceTypeUnit(connection.type),
    readingDate: data.issued_date
      ? parseDate(data.issued_date)
      : parseDate(`02/${month}/${year}`),
    month,
    year,
    type: connection.type,
  };

  return serviceReading;
};
