import {
  MiningRequest,
  ServiceConnectionDTO,
  SERVICE_CONNECTION_TABLE_NAME,
} from "domain/entities";
import { Database, DataSourceImpl } from "domain/interfaces";
import {
  ServiceConnectionRepository,
  ServiceConnectionRepositoryImpl,
} from "domain/repositories";
import { Body, Post, Route } from "tsoa";
import { AbastibleScrap } from "./scrappers/abastible";
import {
  aguasAndinasScrap,
  AguasAndinasScrapInput,
} from "./scrappers/aguas-andinas";
import { aguasAntofagastaScrap } from "./scrappers/aguas-antofagasta";
import { brisaguasScrap } from "./scrappers/brisaguas";
import { CGEScrap } from "./scrappers/cge";
import { enelScrap } from "./scrappers/enel";
import { essalScrap } from "./scrappers/essal";
import { essbioScrap } from "./scrappers/essbio";
import { esvalScrap } from "./scrappers/esval";
import { lipigasScrap } from "./scrappers/lipigas";
import { MetrogasScrap, MetrogasScrapInput } from "./scrappers/metrogas";
import { saesaScrap } from "./scrappers/saesa";
import { aguasDelValleScrap } from "./scrappers/aguas-del-valle";
import { chilquintaScrap } from "./scrappers/chilquinta";

interface ScrappingInput {
  serviceConnectionId: string;
}

@Route("scrapper")
export default class Controller {
  private connectionRepository: ServiceConnectionRepository;
  // private scrapDataRepository: ScrapDataRepository;

  constructor(database: Database) {
    this.connectionRepository = new ServiceConnectionRepositoryImpl(
      new DataSourceImpl<ServiceConnectionDTO>(
        database,
        SERVICE_CONNECTION_TABLE_NAME
      )
    );
  }

  @Post("/brisaguas")
  public async brisaguas(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };

    const miningDates = await brisaguasScrap({
      ...scrapInput,
      serviceConnectionId,
      serviceKey: connection.serviceKey as string,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/enel-cl")
  public async enel(@Body() input: ScrappingInput): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );
      
    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };

    const miningDates = await enelScrap({
      ...scrapInput,
      serviceConnectionId,
      serviceKey: connection.serviceKey as string,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/cge")
  public async cge(@Body() input: ScrappingInput): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };

    const miningDates = await CGEScrap({
      clientId: scrapInput.clientId,
      serviceConnectionId,
      serviceKey: connection.serviceKey as string,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/metrogas")
  public async metrogas(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    
    const scrapInput: MetrogasScrapInput = connection.config as unknown as MetrogasScrapInput;

    const miningDates = await MetrogasScrap({
      clientId: scrapInput.clientId,
      password: scrapInput.password,
      serviceConnectionId,
      serviceKey: connection.serviceKey as string,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/abastible")
  public async abastible(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };

    const miningDates = await AbastibleScrap({
      clientId: scrapInput.clientId,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/aguas-andinas")
  public async aguasAndinas(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput: AguasAndinasScrapInput =
      connection.config as unknown as AguasAndinasScrapInput;
    const miningDates = await aguasAndinasScrap({
      clientId: scrapInput.clientId,
      serviceConnectionId,
      serviceKey: connection.serviceKey as string,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/essal")
  public async essal(@Body() input: ScrappingInput): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };

    const miningDates = await essalScrap({
      ...scrapInput,
      serviceConnectionId,
      serviceKey: connection.serviceKey as string,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/lipigas")
  public async lipigas(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
      password: string;
    };

    const miningDates = await lipigasScrap({
      clientId: scrapInput.clientId,
      password: scrapInput.password,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/essbio")
  public async essbio(@Body() input: ScrappingInput): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;
    console.log("ingresando");
    
    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
      password: string
    };
    console.log("input - ",  scrapInput);
    
    const miningDates = await essbioScrap({
      clientId: scrapInput.clientId,
      password:scrapInput.password
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/esval")
  public async esval(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;

    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };

    const miningDates = await esvalScrap({
      clientId: scrapInput.clientId,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/saesa")
  public async saesa(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;
  
    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );
    
    if (!connection) {
      throw new Error("Connection not found");
    }
  
    const scrapInput = connection.config as unknown as {
      clientId: string;
    };
    console.log("input - " ,scrapInput);
    if(scrapInput.clientId == undefined || scrapInput.clientId == null) {
      throw new Error("clientId is undefined");
    }
    const miningDates = await saesaScrap({
      clientId: scrapInput.clientId
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }
  
  @Post("/aguas-antofagasta")
  public async aguasAntofagasta(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;
  
    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );
    
    if (!connection) {
      throw new Error("Connection not found");
    }
  
    const scrapInput = connection.config as unknown as {
      clientId: string;
    };
    console.log("input - " ,scrapInput);
    if(scrapInput.clientId == undefined || scrapInput.clientId == null) {
      throw new Error("clientId is undefined");
    }
    const miningDates = await aguasAntofagastaScrap({
      clientId: scrapInput.clientId
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/aguas-del-valle")
  public async aguasDelValle(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;
    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
    };
    console.log(scrapInput)
    const miningDates = await aguasDelValleScrap({
      clientId: scrapInput.clientId,
    });

    return miningDates.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }

  @Post("/chilquinta")
  public async chilquinta(
    @Body() input: ScrappingInput
  ): Promise<MiningRequest[]> {
    const { serviceConnectionId } = input;
    const connection = await this.connectionRepository.getServiceConnectionById(
      serviceConnectionId
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    const scrapInput = connection.config as unknown as {
      clientId: string;
      invoiceId: string
    };
    console.log(scrapInput)
    const {MiningDate, lastInvoiceNumber} = await chilquintaScrap({
      clientId: scrapInput.clientId,
      invoiceId: scrapInput.invoiceId,
    });
    await this.connectionRepository.updateServiceConnection({config:{ clientId: scrapInput.clientId, invoiceId:lastInvoiceNumber }},serviceConnectionId)
        
    return MiningDate.map((miningDate) => ({
      ...miningDate,
      serviceKey: connection.serviceKey as string,
      serviceConnectionId,
    }));
  }
}
