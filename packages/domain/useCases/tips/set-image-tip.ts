import { TipDTO } from "../../entities/tip";
import { TipRepository } from "../../repositories";
import { FileData, StorageService } from "../../services";

export interface SetTipImageUseCaseInput {
  id: string;
  image: FileData;
}
export interface SetTipImageUseCase {
  execute(input: SetTipImageUseCaseInput): Promise<TipDTO>;
}

export interface SetTipImageUseCaseProps {
  tipRepository: TipRepository;
  storageService: StorageService;
}

export class SetTipImageUseCaseImpl implements SetTipImageUseCase {
  tipRepository: TipRepository;
  storageService: StorageService;
  constructor(props: SetTipImageUseCaseProps) {
    this.tipRepository = props.tipRepository;
    this.storageService = props.storageService;
  }

  async execute(input: SetTipImageUseCaseInput): Promise<TipDTO> {
    
    const { id, image } = input;
    
    await this.storageService.saveFile({
      bucket: process.env.FILES_BUCKET as string,
      file: image,
      path: `tips/${id}/image/`,
      fileName: image.filename,
    });
    
    const updatedTip = await this.tipRepository.updateTip(
      {
        image: image.filename,
      },
      id
    );

    const imageUrl = await this.storageService.getFileSignedUrl({
      bucket: process.env.FILES_BUCKET as string,
      path: `tips/${id}/image/${updatedTip.image}`,
    });

    return { ...updatedTip, image: imageUrl };
  }
}
