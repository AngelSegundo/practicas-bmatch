import { ServiceType } from "./service";

export type Usage = {
  [key in ServiceType]: {
    month: string;
    year: string;
    value: number;
    normalizedValue?: number;
    unit: string;
  }[];
};
