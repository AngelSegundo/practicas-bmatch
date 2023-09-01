import { Tip, TipDTO } from "../../entities";
import { TipRepository } from "../../repositories";

export interface UpdateTipUseCaseInput {
  id: string;
  tip: Partial<Tip>;
}
export interface UpdateTipUseCase {
  execute(input: UpdateTipUseCaseInput): Promise<TipDTO>;
}

export interface UpdateTipUseCaseProps {
  tipRepository: TipRepository;
}

export class UpdateTipUseCaseImpl implements UpdateTipUseCase {
  tipRepository: TipRepository;
  constructor(props: UpdateTipUseCaseProps) {
    this.tipRepository = props.tipRepository;
  }

  async execute(input: UpdateTipUseCaseInput): Promise<TipDTO> {
    const { tip, id } = input;
    return this.tipRepository.updateTip(tip, id);
  }
}
