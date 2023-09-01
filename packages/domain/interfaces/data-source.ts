import { BaseEntity } from "../entities/base";
import { Database, Query } from ".";

export interface DataSource<DTO extends BaseEntity> {
  getById(id: string): Promise<DTO>;
  getAll(): Promise<DTO[]>;
  find(query: Query<DTO>): Promise<DTO[]>;
  create(data: DTO): Promise<DTO>;
  update(id: string, data: Partial<DTO>): Promise<DTO>;
  delete(id: string): Promise<void>;
}

export class DataSourceImpl<DTO extends BaseEntity> implements DataSource<DTO> {
  private database: Database;
  private tableName: string;
  constructor(database: Database, tableName: string) {
    this.database = database;
    this.tableName = tableName;
  }

  getById(id: string): Promise<DTO> {
    return this.database.getById<DTO>(this.tableName, id);
  }

  getAll(): Promise<DTO[]> {
    return this.database.getAll<DTO>(this.tableName);
  }

  find(query: Query<DTO>): Promise<DTO[]> {
    return this.database.find<DTO>(this.tableName, query);
  }

  create(data: DTO): Promise<DTO> {
    return this.database.create<DTO>(this.tableName, data);
  }

  update(id: string, data: Partial<DTO>): Promise<DTO> {
    return this.database.update<DTO>(this.tableName, id, data);
  }
  async delete(id: string): Promise<void> {
    await this.database.delete(this.tableName, id);
    return;
  }
}
