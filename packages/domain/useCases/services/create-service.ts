import { Service, ServiceDTO } from "../../entities";
import { ServiceRepository } from "../../repositories/service-repository";

export interface CreateServiceUseCase {
  execute(data: Service): Promise<ServiceDTO>;
}

export class CreateServiceUseCaseImpl implements CreateServiceUseCase {
  serviceRepository: ServiceRepository;
  constructor(serviceRepository: ServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(data: Service): Promise<ServiceDTO> {
    return this.serviceRepository.createService(data);
  }
}
