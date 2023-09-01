import {
 ServiceConnectionDTO,
 SERVICE_CONNECTION_TABLE_NAME,
 ServiceReadingDTO,
 SERVICE_READING_TABLE_NAME,
 ServiceReading,
 ServiceDTO,
 SERVICE_TABLE_NAME,
 UserDTO,
 USER_TABLE_NAME,
} from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
 ServiceConnectionRepository,
 ServiceReadingRepository,
 ServiceConnectionRepositoryImpl,
 ServiceReadingRepositoryImpl,
 ServiceRepository,
 UserRepository,
 ServiceRepositoryImpl,
 UserRepositoryImpl,
} from "domain/repositories";
import { getServiceTypeUnit } from "domain/utilities";
import { Body, Get, Post, Request, Route } from "tsoa";
import {
 ChatCompletionRequestMessage,
 CreateChatCompletionRequest,
 Configuration,
 OpenAIApi,
 CreateChatCompletionResponse,
} from "openai";
import GPT3Tokenizer from "gpt3-tokenizer";
import { GetServiceConnectionsByUserIdUseCaseImpl, GetServiceConnectionsDetailedByUserIdUseCaseImpl } from "domain/useCases";
import { StorageService } from "domain/services";
import { Request as ExpressRequest } from "express";


const updateConnectionReading = async (
 month: string,
 year: string,
 serviceConnectionId: string,
 data: ServiceReading,
 readingRepository: ServiceReadingRepository
) => {
 const serviceReadings =
   await readingRepository.getServiceReadingByYearAndMonth(
     serviceConnectionId,
     month,
     year
   );
 if (serviceReadings.length === 0) {
   return await readingRepository.createServiceReading(data);
 } else {
   return await readingRepository.changeServiceReadingValue(
     data.value,
     serviceReadings[0].id
   );
 }
};

@Route("ia")
export default class IaController {
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

 @Post("/chat")
 public async chatGPT(@Body() request: responseRequestBody): Promise<any> {
  console.log(request);
  
  const { userId, messages, type } = request;
  console.log({ userId, messages, type });
  
  const useCase = new GetServiceConnectionsDetailedByUserIdUseCaseImpl(
    this.serviceConnectionRepository,
    this.serviceReadingRepository,
    this.userRepository,
    this.serviceRepository,
    this.storageService
  );
  
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
 
  const connectionsDetailed = await useCase.execute(userId);
  
  const configuration = new Configuration({ 
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const obj = []
  
  const connectionsDetailedForType = (type != "all")? connectionsDetailed.filter( x => x.type == type ): connectionsDetailed  // executa ya valida que estatus == "active"
  for (const connection of connectionsDetailedForType) {
      for (const reading of connection.last6readings) {
        // if(connection.type == type && connection.id == reading.serviceConnectionId && connection.status == "active"){
          const { value, readingDate, unit } = reading
          const { serviceId, alias, serviceName , type:typecon } = connection
          obj.push({
            consumo: value,
            mes: months[Number(readingDate.substring(5,7)) - 1],
            año: readingDate.substring(0,4),
            tipo: typecon,
            unidad: unit,
            compañia: serviceId,
            alias : alias ,
            nombre_servicio: serviceName
          })
        }
      // }
  }
  
  const prompt = `Eres "BmatchAssistant" 
  ${(type != "all")? "un experto en consumo y ahorro de " + type + ":" : "un experto en consumo y ahorro de agua, ahorro de gas, ahorro de electricidad:" }
   1. Rechazar responder cualquier pregunta que no este relacionada con consumo y ahorro de agua, ahorro de gas, ahorro de electricidad.
   2. Mantener una comunicación cercana empatica y amable en todo momento.
   3. Dar recomendaciones sobre el consumo del cliente y como puede mejorarlo.
   ${(type != "all")&& "4. Solo analiza la informacion de tipo " + type }
   `;

   console.log(obj);
   
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
  return completion.data;
 }
}

interface responseRequestBody {
 userId: string;
 messages: ChatCompletionRequestMessage[];
 type: string;
}
