import { Body, Delete, Get, Patch, Path, Post, Put, Route } from "tsoa";
import { Tip, TipDTO, TIP_TABLE_NAME } from "domain/entities";
import {
  CreateTipUseCaseImpl,
  DeleteTipUseCaseImpl,
  DeleteImageTipUseCaseImpl,
  GetTipByIdUseCaseImpl,
  GetTipsUseCaseImpl,
  UpdateTipUseCaseImpl,
  SetTipImageUseCaseImpl,
} from "domain/useCases";
import { Database, DataSourceImpl } from "domain/interfaces";
import { TipRepository, TipRepositoryImpl } from "domain/repositories";
import { FileData, StorageService } from "domain/services/storage-service";

@Route("tips")
export default class TipController {
  private tipRepository: TipRepository;
  private storageService: StorageService;

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
  @Post("/")
  public createTip(@Body() tip: Tip): Promise<TipDTO> {
    const useCase = new CreateTipUseCaseImpl(this.tipRepository);
    return useCase.execute(tip);
  }
  @Patch("/{id}")
  public updateTip(
    @Body() tip: Partial<Tip>,
    @Path() id: string
  ): Promise<TipDTO> {
    const useCase = new UpdateTipUseCaseImpl({
      tipRepository: this.tipRepository,
    });
    return useCase.execute({ tip, id });
  }
  @Put("/{id}/image")
  public UploadTipImage(
    @Body() image: FileData,
    @Path() id: string
  ): Promise<TipDTO> {
    const useCase = new SetTipImageUseCaseImpl({
      tipRepository: this.tipRepository,
      storageService: this.storageService,
    });
    const tipDTO = useCase.execute({ image, id });
    return tipDTO;
  }

  @Delete("/{id}")
  public deleteTip(@Path() id: string): Promise<void> {
    const useCase = new DeleteTipUseCaseImpl({
      tipRepository: this.tipRepository,
    });
    return useCase.execute({ id });
  }

  @Delete("/{id}/image")
  public async deleteTipImage(id: string): Promise<TipDTO> {
    const tip = await this.tipRepository.getTipById(id);

    const useCase = new DeleteImageTipUseCaseImpl({
      tipRepository: this.tipRepository,
    });

    if (!tip) {
      throw new Error("Tip not found");
    }

    return useCase.execute({
      tip,
      id,
    });
  }
}
