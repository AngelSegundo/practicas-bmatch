import {
  ServiceConnectionDTO,
  SERVICE_CONNECTION_TABLE_NAME,
  ServiceReadingDTO,
  SERVICE_READING_TABLE_NAME,
  MiningRequest,
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
import { ticketOps as brisaguasOps } from "./miners/brisaguas.ops";
import { ticketOps as aguasAndinasOps } from "./miners/aguas-andinas.ops";
import { ticketOps as metrogasOps } from "./miners/metrogas.ops";
import { ticketOps as essalOps } from "./miners/essal.ops";
import { enelCLMiner } from "./miners/enel-cl.miner";
import { ticketOps as enelCLOps } from "./miners/enel-cl.ops";
import { parseDate } from "./utils/dateParser";
import { genericMiner } from "./utils/genericMiner";
import { essbioHandler } from "./miners/essbio";
import { prossesGraph } from "./utils/imgToChart/imgToChart";// nubisk JoseA
import { metrogasHandler } from "./miners/metrogas";

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

const addHistoryConnectionReading = async (
  month: string,
  year: string,
  serviceConnectionId: string,
  data: ServiceReading,
  readingRepository: ServiceReadingRepository
) : Promise<ServiceReadingDTO>  =>  {
  const serviceReadings =
    await readingRepository.getServiceReadingByYearAndMonth(
      serviceConnectionId,
      month,
      year
    );
    
   if (serviceReadings.length === 0) {
    return await readingRepository.createServiceReading(data);
  } else{
    return serviceReadings[0]
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

  @Post("/brisaguas")
  public async brisaguas(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }
    const { serviceKey, type } = serviceConnection;

    const data = await genericMiner({
      input: {
        month,
        year,
        serviceConnectionId,
        serviceKey: serviceKey as string,
        serviceType: type,
      },
      connection: serviceConnection,
      operations: brisaguasOps,
    });updateConnectionReading
    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  /* @Post("/aguas-andinas")
  public async aguasAndinas(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId } = input;
    const serviceConnection = 
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }
    const { serviceKey, type } = serviceConnection;
    const data = await genericMiner({
      input: {
        month,
        year,
        serviceConnectionId,
        serviceKey: serviceKey as string,
        serviceType: type,
      },
      connection: serviceConnection,
      operations: aguasAndinasOps,
    });

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  } */

  @Post("/aguas-andinas")
  public async aguasAndinas(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }
    const { serviceKey, type } = serviceConnection;

    const data = await genericMiner({
      input: {
        month,
        year,
        serviceConnectionId,
        serviceKey: serviceKey as string,
        serviceType: type,
      },
      connection: serviceConnection,
      operations: aguasAndinasOps,
    });

    const bucket = process.env.BUCKET_NAME as string
    const filePath= `${type}/${serviceKey}/${serviceConnectionId}/${year}/${month}/data.pdf`
    const file = { bucket, filePath}


    const history = await prossesGraph(data.value, month, year, file, serviceConnection, serviceConnectionId  )
    if(history.length ==0){
      history.push({
        serviceId: serviceConnection.serviceId,
        serviceConnectionId,
        userId: serviceConnection.userId,
        value: data.value,
        unit: getServiceTypeUnit(serviceConnection.type),
        readingDate: parseDate(`01/${month}/${year}`),
        month,
        year,
        type: serviceConnection.type,
      })
    }else{
      history.filter(x => x.month==month && x.year ==year)[0].value = data.value
    }
    const createdReading :ServiceReadingDTO[] =[]
    for (const serviceReading of history) {
      const {month,year, serviceConnectionId  }=serviceReading
      createdReading.push(await addHistoryConnectionReading(
        month!,
        year!,
        serviceConnectionId,
        serviceReading,
        this.readingRepository
      ))
    }
    console.log(createdReading);
    
    return createdReading[createdReading.length-1];
  }


  @Post("/enel-cl")
  public async enelCL(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }
    const { serviceKey, type } = serviceConnection;

    const data = await enelCLMiner({
      input: {
        month,
        year,
        serviceConnectionId,
        serviceKey: serviceKey as string,
        serviceType: type,
      },
      connection: serviceConnection,
      operations: enelCLOps,
    });

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  @Post("/cge")
  public async cge(@Body() input: MiningRequest): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value, date } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("CGE", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: date ?? parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  @Post("/metrogas")
  public async metrogas(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("metrogas - ", input);

    const { serviceKey, type } = serviceConnection;
  
    const data = await metrogasHandler({
      input: {
        month,
        year,
        serviceConnectionId,
        serviceKey: serviceKey as string,
        serviceType: type,
      },
      connection: serviceConnection,
    });

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  @Post("/abastible")
  public async abastible(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value, date } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("abastible - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: date ?? parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  @Post("/lipigas")
  public async lipigas(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value, date } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("lipigas - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: date ?? parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  @Post("/essal")
  public async essal(@Body() input: MiningRequest): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, date } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }
    const { serviceKey, type } = serviceConnection;

    const data = await genericMiner({
      input: {
        month,
        year,
        serviceConnectionId,
        serviceKey: serviceKey as string,
        serviceType: type,
      },
      connection: serviceConnection,
      operations: essalOps,
    });

    data.readingDate = date ?? parseDate(`01/${month}/${year}`);

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    return createdReading;
  }

  @Post("/essbio")
  public async essbio(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId ,value} = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }
    console.log("essbio - ", input);

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value!,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );

    return createdReading;
  }

  @Post("/esval")
  public async esval(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("esval - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    
    return createdReading;
  }

  @Post("/saesa")
  public async saesa(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("saesa - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    
    return createdReading;
  }

  @Post("/aguas-antofagasta")
  public async aguasAntofagasta(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("aguas-antofagasta - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value: value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    
    return createdReading;
  }

  @Post("/aguas-del-valle")
  public async aguasDelValle(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("aguas-del-valle - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    
    return createdReading;
  }

  @Post("/chilquinta")
  public async chilquinta(
    @Body() input: MiningRequest
  ): Promise<ServiceReadingDTO> {
    const { month, year, serviceConnectionId, value } = input;
    const serviceConnection =
      await this.connectionRepository.getServiceConnectionById(
        serviceConnectionId
      );
    if (!serviceConnection) {
      throw new Error("Service connection not found");
    }

    console.log("chilquinta - ", input);

    if (value === undefined || value === null) {
      throw new Error("Value is required");
    }

    const data: ServiceReading = {
      serviceId: serviceConnection.serviceId,
      serviceConnectionId,
      userId: serviceConnection.userId,
      value,
      unit: getServiceTypeUnit(serviceConnection.type),
      readingDate: parseDate(`01/${month}/${year}`),
      month,
      year,
      type: serviceConnection.type,
    };

    const createdReading = updateConnectionReading(
      month,
      year,
      serviceConnectionId,
      data,
      this.readingRepository
    );
    
    return createdReading;
  }

  @Get("/prueba")
  public async prueba(): Promise<string> {
    
    return "hola mundo";
  }
}
