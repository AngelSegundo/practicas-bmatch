import { CountryDTO } from "../../entities/country";
import { CountryRepository } from "../../repositories/country-repository";

export interface GetCountriesUseCase {
  execute(): Promise<CountryDTO[]>;
}

export class GetCountriesUseCaseImpl implements GetCountriesUseCase {
  countryRepository: CountryRepository;
  constructor(countryRepositry: CountryRepository) {
    this.countryRepository = countryRepositry;
  }

  async execute(): Promise<CountryDTO[]> {
    return this.countryRepository.getCountries();
  }
}
