
import {
  ServiceConnection,
  ServiceConnectionDTO,
} from "../../entities/service-connection";
import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";

/**
 * Interfaz para definir el caso de uso "CreateServiceConnection".
 * Este caso de uso es responsable de crear una nueva conexión de servicio.
 */
export interface CreateServiceConnectionUseCase {
    /**
   * Función que ejecuta el caso de uso "CreateServiceConnection".
   * @param data Objeto que contiene la información de la conexión de servicio a crear.
   * @returns Promesa que devuelve un objeto "ServiceConnectionDTO" que contiene la información de la conexión de servicio creada.
   * @throws Error si ya existe una conexión de servicio con el mismo ID de cliente y el mismo tipo de servicio.
   */
  execute(data: ServiceConnection): Promise<ServiceConnectionDTO>;
}
/** 
* Implementación de la interfaz "CreateServiceConnectionUseCase".
*/
export class CreateServiceConnectionUseCaseImpl
  implements CreateServiceConnectionUseCase
{
  serviceConnectionRepository: ServiceConnectionRepository;
  constructor(serviceConnectionRepository: ServiceConnectionRepository) {
    this.serviceConnectionRepository = serviceConnectionRepository;
  }

  async execute(data: ServiceConnection): Promise<ServiceConnectionDTO> {
    const { userId, serviceId } = data;
    const servicesConnections = await this.serviceConnectionRepository.getServiceConnectionsByUserId(userId);
    
    const existingServiceConnection = servicesConnections.find((service) => service.config.clientId == data.config.clientId)
    
    if(existingServiceConnection){
        if(existingServiceConnection.serviceId === serviceId){
          throw new Error(`Service ${data.config.clientId} already exists`);
        }
    }
    
    const serviceConnection =
      await this.serviceConnectionRepository.createServiceConnection(data);
    return serviceConnection;
  }
}
