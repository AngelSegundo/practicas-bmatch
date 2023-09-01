import { ServiceType } from "../entities";

export function getServiceTypeUnit(type: ServiceType) {
  if (type === ServiceType.electricity) {
    return "kWh";
  }
  if (type === ServiceType.gas) {
    return "m3";
  }
  if (type === ServiceType.water) {
    return "m3";
  }
  if (type === ServiceType.freeway) {
    return "km";
  }
  return "unkown";
}
