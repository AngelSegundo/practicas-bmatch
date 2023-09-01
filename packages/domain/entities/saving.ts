import { ServiceType } from "./service";

export interface Saving {
  value: number;
  unit: string;
  type: ServiceType;
  connectionId: string;
}
export type Savings = {
  [key in string]: Saving;
};
