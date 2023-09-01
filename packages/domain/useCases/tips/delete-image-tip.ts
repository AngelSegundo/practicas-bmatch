import { Tip, TipDTO } from "../../entities";
import { TipRepository } from "../../repositories";

export interface DeleteImageTipUseCaseInput {
  id: string;
  tip: Partial<Tip>;
}
export interface DeleteImageTipUseCase {
  execute(input: DeleteImageTipUseCaseInput): Promise<TipDTO>;
}

export interface DeleteImageTipUseCaseProps {
  tipRepository: TipRepository;
}

export class DeleteImageTipUseCaseImpl implements DeleteImageTipUseCase {
  tipRepository: TipRepository;
  constructor(props: DeleteImageTipUseCaseProps) {
    this.tipRepository = props.tipRepository;
  }

  async execute(input: DeleteImageTipUseCaseInput): Promise<TipDTO> {
    const { tip, id } = input;

    return this.tipRepository.updateTip({ ...tip, image: "" }, id);
  }
}
