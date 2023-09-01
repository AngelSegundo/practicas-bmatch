import {
  ServiceConnectionDTO,
  SERVICE_CONNECTION_TABLE_NAME,
  ServiceReadingDTO,
  SERVICE_READING_TABLE_NAME,
  ServiceReading,
} from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
  ServiceConnectionRepository,
  ServiceReadingRepository,
  ServiceConnectionRepositoryImpl,
  ServiceReadingRepositoryImpl,
} from "domain/repositories";
import { getServiceTypeUnit } from "domain/utilities";
import { Body, Get, Post, Route } from "tsoa";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  Configuration,
  OpenAIApi,
  CreateChatCompletionResponse,
} from "openai";
import GPT3Tokenizer from "gpt3-tokenizer";


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

@Route("miners")
export default class Controller {
  private connectionRepository: ServiceConnectionRepository;
  private readingRepository: ServiceReadingRepository;

  constructor(database: Database) {
    this.connectionRepository = new ServiceConnectionRepositoryImpl(
      new DataSourceImpl<ServiceConnectionDTO>(
        database,
        SERVICE_CONNECTION_TABLE_NAME
      )
    );
    this.readingRepository = new ServiceReadingRepositoryImpl(
      new DataSourceImpl<ServiceReadingDTO>(
        database,
        SERVICE_READING_TABLE_NAME
      )
    );
  }

  @Post("/chat")
  public async chatGPT(@Body() input: responseRequestBody): Promise<CreateChatCompletionResponse> {
    const { userId, messages, type }: responseRequestBody = input;
    
    console.log({userId})
    
    const configuration = new Configuration({ 
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
 
    // const dataReading =await this.readingRepository.getLastsSixMonthsUserServicesReadings(userId)
    const dataReading =await this.readingRepository.getLastsTwoMonthsUserServicesReadings(userId)
    const dataConnection =await this.connectionRepository.getServiceConnectionsByUserId(userId)

    console.log(dataConnection);
    console.log(dataReading)
    const obj = []
    for (const connection of dataConnection) {
        for (const reading of dataReading) {
          if(connection.type == type && connection.id == reading.serviceConnectionId && connection.status == "active"){
            const { value, month, year, type, unit } = reading
            const { serviceKey, alias, id } = connection
            obj.push({
              consumo: value,
              mes: months[Number(month) - 1],
              año: year,
              tipo: type,
              unidad: unit,
              compañia: serviceKey,
              alias : alias ,
              id
            })
          }
        }
    }
    
    console.log(obj);
    
    //console.log(month[6 - 1])
    const prompt = `Eres "BmatchAssistant" un experto en consumo y ahorro energetico, ahorro de agua y de gas:
     1. Rechazar responder cualquier pregunta que no este relacionada con consumo y ahorro energetico, de agua, luz o gas.
     2. Mantener una comunicación cercana empatica y amable en todo momento.
     3. Dar recomendaciones sobre el consumo del cliente y como puede mejorarlo.
     4. Solo analiza la informacion de tipo ${type}
     `;
    /*const obj = dataReading.map((d) => ({
      consumo: d.value,
      mes: month[Number(d.month) - 1],
      año: d.year,
      tipo: d.type,
      unidad: d.unit,
       servicioEspecifico: d.servickey,
      alias : d.alias 
    }));*/

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
            "Estos son mis datos de consumo en los ultimos 2 meses" + cleanData,
        },
        ...messages,
      ],
      temperature: 0.5,
    };

    const completion = await openai.createChatCompletion(apiRequestBody);
    //res.json(completion.data);
    return completion.data;
  }

  @Get("/prueba")
  public async prueba(): Promise<string> {
    return "hola mundo";
  }
}

interface responseRequestBody {
  type: string;
  userId: string;
  messages: ChatCompletionRequestMessage[];
}
