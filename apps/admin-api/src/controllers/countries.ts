import { Get, Route } from "tsoa";
import { CountryRepository } from "domain/repositories";
import { CountryDTO } from "domain/entities";
import {
  GetCountriesUseCaseImpl,
  GetCountryByIdUseCaseImpl,
} from "domain/useCases";

@Route("countries")
export default class CountryController {
  private repository: CountryRepository;
  constructor(repository: CountryRepository) {
    this.repository = repository;
  }

  @Get("/")
  public getAll(): Promise<CountryDTO[]> {
    const useCase = new GetCountriesUseCaseImpl(this.repository);
    return useCase.execute();
  }

  @Get("{countryId}")
  public getById(countryId: string): Promise<CountryDTO> {
    const useCase = new GetCountryByIdUseCaseImpl(this.repository);
    return useCase.execute(countryId);
  }
}
