import { ServiceReading, ServiceType } from "../entities";
import { Saving } from "../entities/saving";

export const calculateSaving = (
  last2MonthsReadings: ServiceReading[]
): Saving => {
  const connectionId =
    last2MonthsReadings.length > 0
      ? last2MonthsReadings[0].serviceConnectionId
      : "";
  const type =
    last2MonthsReadings.length > 0
      ? last2MonthsReadings[0].type
      : ServiceType.water;
  const unit =
    last2MonthsReadings.length > 0 ? last2MonthsReadings[0].unit : "";

  let saving: Saving;

  if (last2MonthsReadings.length === 2) {
    // si no tiene valor en el mes actual lo setea a la constante "1"
    if (last2MonthsReadings[0].value === 0)
      saving = {
        connectionId: connectionId,
        value: ((1 - last2MonthsReadings[1].value) / 1) * 100,
        unit: unit,
        type: type,
      };
    else {
      saving = {
        connectionId: connectionId,
        value:
          ((last2MonthsReadings[0].value - last2MonthsReadings[1].value) /
            last2MonthsReadings[0].value) *
          100,
        unit: unit,
        type: type,
      };
    }
  } else {
    saving = {
      connectionId: connectionId,
      value: 0,
      unit: unit,
      type: type,
    };
  }
  return saving;
};
