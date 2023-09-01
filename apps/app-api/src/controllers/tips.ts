import { Get, Route, Path } from "tsoa";
import { TipDTO, TIP_TABLE_NAME } from "domain/entities";
import { GetTipsUseCaseImpl, GetTipByIdUseCaseImpl } from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { TipRepository, TipRepositoryImpl } from "domain/repositories";
import { StorageService } from "domain/services/storage-service";

@Route("tips")
export default class TipController {
  private tipRepository: TipRepository;
  storageService: StorageService;

  constructor(database: Database, storageService: StorageService) {
    this.tipRepository = new TipRepositoryImpl(
      new DataSourceImpl<TipDTO>(database, TIP_TABLE_NAME)
    );
    this.storageService = storageService;
  }
  @Get("/")
  public getTips(): Promise<TipDTO[]> {
    const useCase = new GetTipsUseCaseImpl({
      tipRepository: this.tipRepository,
      storageService: this.storageService,
    });
    return useCase.execute();
  }
  @Get("{id}")
  public getById(@Path() id: string): Promise<TipDTO> {
    const useCase = new GetTipByIdUseCaseImpl({
      tipRepository: this.tipRepository,
      storageService: this.storageService,
    });
    return useCase.execute(id);
  }
}
