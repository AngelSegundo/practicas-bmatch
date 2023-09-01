import { OfficerDTO } from "domain/entities";
import { OfficerRepository } from "domain/repositories";
import { GetOfficerByIdUseCaseImpl } from "domain/useCases";
import { Get, Query, Route } from "tsoa";

@Route("officers")
export default class OfficerController {
  private repository: OfficerRepository;
  constructor(repository: OfficerRepository) {
    this.repository = repository;
  }

  @Get("{id}")
  public getByTaxId(@Query() id: string): Promise<OfficerDTO> {
    const useCase = new GetOfficerByIdUseCaseImpl(this.repository);
    return useCase.execute(id);
  }
}
