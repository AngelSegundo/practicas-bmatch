import { ServiceReadingDTO } from "../../entities";
import { ServiceReadingRepository } from "../../repositories";

export interface ChangeServiceReadingValueUseCaseInput {
  value: number;
  id: string;
}
export interface ChangeServiceReadingValueUseCase {
  execute(
    input: ChangeServiceReadingValueUseCaseInput
  ): Promise<ServiceReadingDTO>;
}
export class ChangeServiceReadingValueUseCaseImpl
  implements ChangeServiceReadingValueUseCase
{
  serviceReadingRepository: ServiceReadingRepository;
  constructor(serviceReadingRepository: ServiceReadingRepository) {
    this.serviceReadingRepository = serviceReadingRepository;
  }
  async execute(
    input: ChangeServiceReadingValueUseCaseInput
  ): Promise<ServiceReadingDTO> {
    const { value, id } = input;
    return this.serviceReadingRepository.changeServiceReadingValue(value, id);
  }
}
