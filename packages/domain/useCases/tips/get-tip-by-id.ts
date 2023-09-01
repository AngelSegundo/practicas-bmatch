import { TipDTO } from "../../entities/tip";
import { TipRepository } from "../../repositories/tip-repository";
import { StorageService } from "../../services";

export interface GetTipByIdUseCase {
  execute(id: string): Promise<TipDTO>;
}

export interface GetTipByIdUseCaseInput {
  tipRepository: TipRepository;
  storageService: StorageService;
}

export class GetTipByIdUseCaseImpl implements GetTipByIdUseCase {
  private tipRepository: TipRepository;
  private storageService: StorageService;

  constructor(props: GetTipByIdUseCaseInput) {
    this.tipRepository = props.tipRepository;
    this.storageService = props.storageService;
  }

  async execute(id: string): Promise<TipDTO> {
    const tip = await this.tipRepository.getTipById(id);
    
    if (tip && tip.image) {
      const imageUrl = await this.storageService.getFileSignedUrl({
        bucket: process.env.FILES_BUCKET as string,
        path: `tips/${id}/image/${tip.image}`,
      });
      tip.image = imageUrl;
    }
    return tip;
  }
}
