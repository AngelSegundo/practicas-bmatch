import { Get, Route } from "tsoa";
import { CountryRepository, CountryRepositoryImpl } from "domain/repositories";
import { CountryDTO, COUNTRY_TABLE_NAME } from "domain/entities";
import { GetCountriesUseCaseImpl } from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";

@Route("countries")
export default class CountryController {
  private repository: CountryRepository;
  constructor(database: Database) {
    this.repository = new CountryRepositoryImpl(
      new DataSourceImpl<CountryDTO>(database, COUNTRY_TABLE_NAME)
    );
  }

  @Get("/")
  public getAll(): Promise<CountryDTO[]> {
    const useCase = new GetCountriesUseCaseImpl(this.repository);
    return useCase.execute();
  }
}
