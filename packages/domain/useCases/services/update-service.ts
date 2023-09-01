import { Service, ServiceDTO } from "../../entities";
import { ServiceRepository } from "../../repositories/service-repository";

export interface UpdateServiceUseCase {
  execute({
    id,
    data,
  }: {
    id: string;
    data: Partial<Service>;
  }): Promise<ServiceDTO>;
}

export class UpdateServiceUseCaseImpl implements UpdateServiceUseCase {
  serviceRepository: ServiceRepository;
  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute({
    id,
    data,
  }: {
    id: string;
    data: Partial<Service>;
  }): Promise<ServiceDTO> {
    return this.serviceRepository.updateService(data, id);
  }
}
