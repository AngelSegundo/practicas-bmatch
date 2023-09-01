import { Database, Query, QuerySearchTypes } from "domain/interfaces";
import { BaseEntity } from "../entities/base";

export class MemoryDatabase implements Database {
  public data: { [key: string]: { [key: string]: any } } = {};

  getById<T>(tableName: string, id: string): Promise<T> {
    return Promise.resolve(this.data[tableName][id] as T);
  }

  getAll<T>(tableName: string): Promise<any> {
    return Promise.resolve(Object.values(this.data[tableName] ?? {}) as T[]);
  }

  find<T>(tableName: string, query: Query<T>): Promise<T[]> {
    if (query.length < 0) this.getAll<T>(tableName);

    const results = Object.values(this.data[tableName])?.filter((item: T) => {
      return query.every(({ fieldName, searchType, value }) => {
        if (searchType === QuerySearchTypes.EQUALS) {
          return item[fieldName] === value;
        }
        if (searchType === QuerySearchTypes.GREATER_THAN_EQUALS) {
          return item[fieldName] >= value;
        }
        if (searchType === QuerySearchTypes.LESS_THAN_EQUALS) {
          return item[fieldName] <= value;
        }
        if (searchType === QuerySearchTypes.GREATER_THAN) {
          return item[fieldName] > value;
        }
        if (searchType === QuerySearchTypes.LESS_THAN) {
          return item[fieldName] < value;
        }
        if (searchType === QuerySearchTypes.ARRAY_CONTAINS) {
          return (item[fieldName] as any).includes(value);
        }
      });
    });

    return Promise.resolve(results);
  }

  create<T>(tableName: string, item: any): Promise<any> {
    if (!this.data[tableName]) this.data[tableName] = {};
    this.data[tableName][item.id] = item;
    return Promise.resolve(item);
  }

  update<T extends BaseEntity>(
    tableName: string,
    id: string,
    item: Partial<Omit<T, "id" | "createdAt" | "udpatedAt">>
  ): Promise<T> {
    this.data[tableName][id] = {
      ...this.data[tableName][id],
      ...item,
    };
    return this.getById(tableName, id);
  }

  delete<T extends BaseEntity>(tableName: string, id: string): Promise<T> {
    const item = this.data[tableName][id];
    delete this.data[tableName][id];
    return Promise.resolve(item);
  }
}
