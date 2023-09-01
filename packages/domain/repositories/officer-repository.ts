import { DataSource } from "../interfaces";
import { OfficerDTO } from "../entities";

export interface OfficerRepository {
  getOfficerById(id: string): Promise<OfficerDTO>;
}

export class OfficerRepositoryImpl implements OfficerRepository {
  private dataSource: DataSource<OfficerDTO>;
  constructor(dataSource: DataSource<OfficerDTO>) {
    this.dataSource = dataSource;
  }

  getOfficerById(id: string): Promise<OfficerDTO> {
    return this.dataSource.getById(id);
  }
}
