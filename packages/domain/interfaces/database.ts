import { BaseEntity } from "../entities/base";

export enum QuerySearchTypes {
  EQUALS = "==",
  GREATER_THAN_EQUALS = ">=",
  LESS_THAN_EQUALS = "<=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  ARRAY_CONTAINS = "array-contains",
}

export type Query<T> = {
  fieldName: keyof T;
  searchType: QuerySearchTypes;
  value: T[keyof T];
}[];

export interface Database {
  getAll<T extends BaseEntity>(tableName: string): Promise<T[]>;
  getById<T extends BaseEntity>(tableName: string, id: string): Promise<T>;
  find<T extends BaseEntity>(tableName: string, query: Query<T>): Promise<T[]>;
  create<T extends BaseEntity>(tableName: string, item: T): Promise<T>;
  update<T extends BaseEntity>(
    tableName: string,
    id: string,
    item: Partial<Omit<T, "id" | "createdAt" | "udpatedAt">>
  ): Promise<T>;
  delete(tableName: string, id: string): Promise<void>;
}
