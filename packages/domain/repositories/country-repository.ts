import { DataSource } from "../interfaces/data-source";
import { CountryDTO } from "../entities/country";

export interface CountryRepository {
  getCountries(): Promise<CountryDTO[]>;
  getCountryById(id: string): Promise<CountryDTO>;
}

export class CountryRepositoryImpl implements CountryRepository {
  dataSource: DataSource<CountryDTO>;
  constructor(dataSource: DataSource<CountryDTO>) {
    this.dataSource = dataSource;
  }

  async getCountries(): Promise<CountryDTO[]> {
    return this.dataSource.getAll();
  }
  getCountryById(id: string): Promise<CountryDTO> {
    return this.dataSource.getById(id);
  }
}
