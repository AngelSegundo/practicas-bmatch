import { RewardDTO } from "../../entities/reward";
import { RewardRepository } from "../../repositories";
import { FileData, StorageService } from "../../services";

export interface SetRewardPictureUseCaseInput {
  id: string;
  picture: FileData;
}
export interface SetRewardPictureUseCase {
  execute(input: SetRewardPictureUseCaseInput): Promise<RewardDTO>;
}

export interface SetRewardPictureUseCaseProps {
  rewardRepository: RewardRepository;
  storageService: StorageService;
}

export class SetRewardPictureUseCaseImpl implements SetRewardPictureUseCase {
  rewardRepository: RewardRepository;
  storageService: StorageService;
  constructor(props: SetRewardPictureUseCaseProps) {
    this.rewardRepository = props.rewardRepository;
    this.storageService = props.storageService;
  }

  async execute(input: SetRewardPictureUseCaseInput): Promise<RewardDTO> {
    const { id, picture } = input;
    await this.storageService.saveFile({
      bucket: process.env.FILES_BUCKET as string,
      file: picture,
      path: `rewards/${id}/picture/`,
      fileName: picture.filename,
    });
    const updatedReward = await this.rewardRepository.updateReward(
      {
        picture: picture.filename,
      },
      id
    );

    const pictureUrl = await this.storageService.getFileSignedUrl({
      bucket: process.env.FILES_BUCKET as string,
      path: `rewards/${id}/profile-picture/${updatedReward.picture}`,
    });

    return { ...updatedReward, picture: pictureUrl };
  }
}
