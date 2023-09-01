import { ServiceDTO, ServiceReadingDTO } from "../../entities";
import { ServiceConnectionDetailed } from "../../entities/service-connection-detailed";
import {
  ServiceReadingRepository,
  ServiceRepository,
  UserRepository,
} from "../../repositories";
import { ServiceConnectionRepository } from "../../repositories/service-connection-repository";
import { StorageService } from "../../services";
import { calculateSaving } from "../../utilities/saving-calculation";

export interface GetServiceConnectionsDetailedByUserIdUseCase {
  execute(userId: string): Promise<ServiceConnectionDetailed[]>;
}

export class GetServiceConnectionsDetailedByUserIdUseCaseImpl
  implements GetServiceConnectionsDetailedByUserIdUseCase
{
  private serviceConnectionRepository: ServiceConnectionRepository;
  private serviceReadingRepository: ServiceReadingRepository;
  private userRepository: UserRepository;
  private serviceRepository: ServiceRepository;
  private storageService: StorageService;

  constructor(
    serviceConnectionRepository: ServiceConnectionRepository,
    serviceReadingRepository: ServiceReadingRepository,
    userRepository: UserRepository,
    serviceRepository: ServiceRepository,
    storageService: StorageService
  ) {
    this.serviceConnectionRepository = serviceConnectionRepository;
    this.serviceReadingRepository = serviceReadingRepository;
    this.userRepository = userRepository;
    this.serviceRepository = serviceRepository;
    this.storageService = storageService;
  }

  async execute(userId: string): Promise<ServiceConnectionDetailed[]> {
    const user = await this.userRepository.getUserById(userId);
    const connections =
      await this.serviceConnectionRepository.getServiceConnectionsByUserId(
        userId
      );

    const activeConnections = connections.filter(
      (conection) => conection.status === "active"
    );

    const services: { [key in string]: ServiceDTO } =
      await activeConnections.reduce(async (servicesAcc, currentConnection) => {
        const service = await this.serviceRepository.getServiceById(
          currentConnection.serviceId
        );
        if (service.logo) {
          const logoUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `services/${service.id}/logo/${service.logo}`,
          });
          service.logo = logoUrl;
        }
        const acc = await servicesAcc;
        acc[currentConnection.id] = service;
        return acc;
      }, Promise.resolve({} as { [key in string]: any }));
    function compareDesc(a: any, b: any) {
      if (a.globalSaving < b.globalSaving) {
        return 1;
      }
      if (a.globalSaving > b.globalSaving) {
        return -1;
      }
      return 0;
    }
    const lastsYearUserReadings: { [key in string]: ServiceReadingDTO[] } =
      await activeConnections.reduce(async (readingsAcc, currentConnection) => {
        const readingsByConnectionId = (
          await this.serviceReadingRepository.getServiceReadingsByServiceConnectionId(
            currentConnection.id
          )
        ).sort(compareDesc);
        const acc = await readingsAcc;
        acc[currentConnection.id] = readingsByConnectionId.filter(
          (reading) => reading.value !== null && reading.value !== undefined
        );
        return acc;
      }, Promise.resolve({} as { [key in string]: any }));

    const connectionsDetailed: ServiceConnectionDetailed[] =
      activeConnections.map((connection) => {
        const lasts6UserConnectionReadings =
          lastsYearUserReadings[connection.id as string].slice(-6);
        const last2UserConnectionsReadings =
          lastsYearUserReadings[connection.id as string].slice(-2);
        const saving = calculateSaving(last2UserConnectionsReadings);
        const last6ReadingsData = lasts6UserConnectionReadings.map(
          (reading) => {
            return {
              readingId: reading.id,
              readingDate: reading.readingDate,
              value: reading.value,
              unit: reading.unit,
              scrapperInstance: reading.scrapperInstance,
            };
          }
        );
        let message;
        if (saving.value < 0)
          message = `Has ahorrado ${Math.abs(saving.value)} ${
            saving.unit
          } en los últimos 3 meses ¡Sigue así!`;
        else message = `Este mes no has ahorrado`;

        return {
          serviceConnectionId: connection.id,
          serviceId: connection.serviceId,
          alias: connection.alias,
          serviceName: services[connection.id].name,
          serviceLogo: services[connection.id].logo,
          type: connection.type,
          status: connection.status,
          countryId: user.countryId,
          savingValue: [null, Infinity, -Infinity].includes(saving.value)
            ? 0
            : saving.value,
          savingMessage: message,
          unit: saving.unit,
          last6readings: last6ReadingsData,
        };
      });
    return connectionsDetailed;
  }
}
