import { OfficerDTO } from "../../entities";
import { OfficerRepository } from "../../repositories";

export interface GetOfficerByIdUseCase {
  execute(id: string): Promise<OfficerDTO>;
}

export class GetOfficerByIdUseCaseImpl implements GetOfficerByIdUseCase {
  private officerRepository: OfficerRepository;
  constructor(officerRepository: OfficerRepository) {
    this.officerRepository = officerRepository;
  }

  execute(id: string): Promise<OfficerDTO> {
    return this.officerRepository.getOfficerById(id);
  }
}
