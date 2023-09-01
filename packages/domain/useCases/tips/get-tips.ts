import { TipDTO } from "../../entities";
import { TipRepository } from "../../repositories/tip-repository";
import { StorageService } from "../../services";

export interface GetTipsUseCase {
  execute(): Promise<TipDTO[]>;
}

export interface GetTipsUseCaseInput {
  tipRepository: TipRepository;
  storageService: StorageService;
  // sendIMagesAsURL:
}

export class GetTipsUseCaseImpl implements GetTipsUseCase {
  private tipRepository: TipRepository;
  private storageService: StorageService;

  constructor(props: GetTipsUseCaseInput) {
    this.tipRepository = props.tipRepository;
    this.storageService = props.storageService;
  }

  async execute(): Promise<TipDTO[]> {
    const tips = await this.tipRepository.getTips();

    tips.sort((a, b) => a.order - b.order);

    const tipsImage = Promise.all(
      tips.map(async (tip) => {
        if (tip && tip.image) {
          const imageUrl = await this.storageService.getFileSignedUrl({
            bucket: process.env.FILES_BUCKET as string,
            path: `tips/${tip.id}/image/${tip.image}`,
          });

          tip.image = imageUrl;
        }
        return tip;
      })
    );

    return tipsImage;
  }
}
