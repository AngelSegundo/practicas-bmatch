import { CountryDTO } from "../../entities/country";
import { CountryRepository } from "../../repositories/country-repository";

export interface GetCountryByIdUseCase {
  execute(id: string): Promise<CountryDTO>;
}

export class GetCountryByIdUseCaseImpl implements GetCountryByIdUseCase {
  countryRepository: CountryRepository;
  constructor(countryRepositry: CountryRepository) {
    this.countryRepository = countryRepositry;
  }

  async execute(id: string): Promise<CountryDTO> {
    return this.countryRepository.getCountryById(id);
  }
}
