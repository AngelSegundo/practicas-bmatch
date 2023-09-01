import { Body, Delete, Get, Patch, Path, Post, Request, Route } from "tsoa";
import {
  ServiceConnection,
  ServiceConnectionDTO,
  ServiceDTO,
  ServiceReading,
  ServiceReadingDTO,
  ServiceType,
  SERVICE_CONNECTION_TABLE_NAME,
  SERVICE_READING_TABLE_NAME,
  SERVICE_TABLE_NAME,
  UserDTO,
  USER_TABLE_NAME,
} from "domain/entities";
import {
  ServiceConnectionRepository,
  ServiceConnectionRepositoryImpl,
  ServiceReadingRepository,
  ServiceReadingRepositoryImpl,
  ServiceRepository,
  ServiceRepositoryImpl,
  UserRepository,
  UserRepositoryImpl,
} from "domain/repositories";
import {
  CreateServiceConnectionUseCaseImpl,
  GetServiceConnectionByIdUseCaseImpl,
  InitializeServiceConnectionUseCaseImpl,
  GetUsagesByUserIdUseCaseImpl,
  GetSavingsByUserIdUseCaseImpl,
  GetServiceConnectionsDetailedByUserIdUseCaseImpl,
  UpdateServiceConnectionUseCaseImpl,
  DeleteServiceConnectionUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { Request as ExpressRequest } from "express";
import { Usage } from "domain/entities/usage";
import { Savings } from "domain/entities/saving";
import { ServiceConnectionDetailed } from "domain/entities/service-connection-detailed";
import { StorageService } from "domain/services";
const mockWater3Saver = require("../mock/mockWater3Saver.json");
const mockWaterSaver = require("../mock/mockWaterSaver.json");
const mockWaterNotSaver = require("../mock/mockWaterNotSaver.json");
const mockElectricitySaver = require("../mock/mockElectricitySaver.json");
const mockElectricityNotSaver = require("../mock/mockElectricityNotSaver.json");
const mockGasSaver = require("../mock/mockGasSaver.json");
const mockGasNotSaver = require("../mock/mockGasNotSaver.json");
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  Configuration,
  OpenAIApi,
  CreateChatCompletionResponse,
 } from "openai";
 
@Route("service-connections")
export default class ServiceController {
  private serviceRepository: ServiceRepository;
  private serviceConnectionRepository: ServiceConnectionRepository;
  private serviceReadingRepository: ServiceReadingRepository;
  private userRepository: UserRepository;
  private storageService: StorageService;

  constructor(database: Database, storageService: StorageService) {
    this.serviceRepository = new ServiceRepositoryImpl(
      new DataSourceImpl<ServiceDTO>(database, SERVICE_TABLE_NAME)
    );
    this.serviceConnectionRepository = new ServiceConnectionRepositoryImpl(
      new DataSourceImpl<ServiceConnectionDTO>(
        database,
        SERVICE_CONNECTION_TABLE_NAME
      )
    );
    this.serviceReadingRepository = new ServiceReadingRepositoryImpl(
      new DataSourceImpl<ServiceReadingDTO>(
        database,
        SERVICE_READING_TABLE_NAME
      )
    );
    this.userRepository = new UserRepositoryImpl(
      new DataSourceImpl<UserDTO>(database, USER_TABLE_NAME)
    );
    this.storageService = storageService;
  }

  @Post("/")
  public createServiceConnection(
    @Body() serviceConnection: ServiceConnection
  ): Promise<ServiceConnectionDTO> {
    const useCase = new CreateServiceConnectionUseCaseImpl(
      this.serviceConnectionRepository
    );
    return useCase.execute(serviceConnection);
  }

  @Get("/{serviceConnectionId}/initialize")
  public async initializeServiceConnection(
    @Request() request: ExpressRequest,
    @Path() serviceConnectionId: string
  ): Promise<ServiceReadingDTO[]> {
    const useCase = new InitializeServiceConnectionUseCaseImpl(
      this.serviceReadingRepository,
      this.serviceConnectionRepository
    );
    const useGetServiceConnectionCase = new GetServiceConnectionByIdUseCaseImpl(
      this.serviceConnectionRepository
    );
    const serviceConnection = await useGetServiceConnectionCase.execute(
      serviceConnectionId
    );
    let mock: any[] = [];
    if (serviceConnection.type === ServiceType.water) {
      if (serviceConnection.alias === "3lecturas") mock = mockWater3Saver;
      else if (serviceConnection.alias === "ahorrador") mock = mockWaterSaver;
      else mock = mockWaterNotSaver;
    } else if (serviceConnection.type === ServiceType.electricity) {
      if (serviceConnection.alias === "ahorrador") mock = mockElectricitySaver;
      else mock = mockElectricityNotSaver;
    } else if (serviceConnection.alias === "ahorrador") mock = mockGasSaver;
    else mock = mockGasNotSaver;

    const readings = await Promise.all(
      mock.map((element) => {
        const serviceReading: ServiceReading = {
          value: element.value,
          unit: element.unit,
          readingDate: element.readingDate,
          type: serviceConnection.type,
          serviceId: serviceConnection.serviceId,
          serviceConnectionId: serviceConnectionId,
          userId: serviceConnection.userId,
          month: element.month,
          year: element.year,
        };
        return useCase.execute(serviceReading);
      })
    );
    return readings;
  }

  public async activateServiceConnection(
    @Path() serviceConnectionId: string
  ): Promise<void> {
    await this.serviceConnectionRepository.activeServiceConnections(
      serviceConnectionId
    );
  }

  @Get("/me")
  public async getServiceConnectionsDetailed(
    @Request() request: ExpressRequest
  ): Promise<ServiceConnectionDetailed[]> {
    const user = request.currentUser as UserDTO;
    const useCase = new GetServiceConnectionsDetailedByUserIdUseCaseImpl(
      this.serviceConnectionRepository,
      this.serviceReadingRepository,
      this.userRepository,
      this.serviceRepository,
      this.storageService
    );
    const connectionsDetailed = await useCase.execute(user.id);
    return connectionsDetailed;
  }
  
  @Post("/me/chat")
  public async getServiceConnectionsDetailedChat(
    @Request() request: ExpressRequest
  ): Promise<any> {
    const user = request.currentUser as UserDTO;
    const { messages, type } = request.body;
    
    const useCase = new GetServiceConnectionsDetailedByUserIdUseCaseImpl(
      this.serviceConnectionRepository,
      this.serviceReadingRepository,
      this.userRepository,
      this.serviceRepository,
      this.storageService
    );
    const connectionsDetailed = await useCase.execute(user.id);
    
    const configuration = new Configuration({ 
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    const obj = []
    for (const connection of connectionsDetailed) {
        for (const reading of connection.last6readings) {
          // if(connection.type == type && connection.id == reading.serviceConnectionId && connection.status == "active"){
            const { value, readingDate, unit } = reading
            const { serviceId, alias, serviceName } = connection
            obj.push({
              consumo: value,
              // mes: months[Number(month) - 1],
              año: readingDate,
              tipo: type,
              unidad: unit,
              compañia: serviceId,
              alias : alias ,
              nombre_servicio: serviceName
            })
          }
        // }
    }
    
    const prompt = `Eres "BmatchAssistant" un experto en consumo y ahorro energetico, ahorro de agua y de gas:
    1. Rechazar responder cualquier pregunta que no este relacionada con consumo y ahorro energetico, de agua, luz o gas.
    2. Mantener una comunicación cercana empatica y amable en todo momento.
    3. Dar recomendaciones sobre el consumo del cliente y como puede mejorarlo.
    4. Solo analiza la informacion de tipo ${type}
    `;
 
   let cleanData = "";
   obj.map((d) => {
     cleanData += JSON.stringify(d);
   });
 
   const apiRequestBody: CreateChatCompletionRequest = {
     model: "gpt-3.5-turbo",
     messages: [
       { role: "system", content: prompt },
       {
         role: "user",
         content:
           "Estos son mis datos de consumo en los ultimos 6 meses" + cleanData,
       },
       ...messages,
     ],
     temperature: 0.5,
   };
   
   const completion = await openai.createChatCompletion(apiRequestBody);
   return {
     connections: connectionsDetailed,
     data: cleanData,
     chat: completion.data
   };
    
  }
  
  @Get("{serviceConnectionId}")
  public getById(
    @Path() serviceConnectionId: string
  ): Promise<ServiceConnectionDTO> {
    // todo: tiene que ser solo para ti
    const useCase = new GetServiceConnectionByIdUseCaseImpl(
      this.serviceConnectionRepository
    );
    return useCase.execute(serviceConnectionId);
  }
  @Get("/usages/me")
  public async getUsagesByUserId(
    @Request() request: ExpressRequest
  ): Promise<{ usages: Usage }> {
    const user = request.currentUser as UserDTO;
    const getUsagesByUserIdUseCase = new GetUsagesByUserIdUseCaseImpl(
      this.serviceReadingRepository,
      this.serviceConnectionRepository,
    );
    const { usages } = await getUsagesByUserIdUseCase.execute(user.id);
    return { usages };
  }
  @Get("/savings/me")
  public async getSavingsByUserId(
    @Request() request: ExpressRequest
  ): Promise<{ savings: Savings }> {
    const user = request.currentUser as UserDTO;
    const getSavingsByUserIdUseCase = new GetSavingsByUserIdUseCaseImpl(
      this.serviceReadingRepository,
      this.serviceConnectionRepository,
    );
    const { savings } = await getSavingsByUserIdUseCase.execute(user.id);
    return { savings };
  }
  @Patch("/{id}")
  public updateServiceConnection(
    @Body() serviceConnection: Partial<ServiceConnection>,
    @Path() id: string
  ): Promise<ServiceConnectionDTO> {
    const useCase = new UpdateServiceConnectionUseCaseImpl({
      serviceConnectionRepository: this.serviceConnectionRepository,
    });
    return useCase.execute({ serviceConnection, id });
  }
  @Delete("{id}")
  public deleteById(@Path() id: string): Promise<void> {
    const useCase = new DeleteServiceConnectionUseCaseImpl(
      this.serviceConnectionRepository,
      this.serviceReadingRepository
    );
    return useCase.execute(id);
  }
}
