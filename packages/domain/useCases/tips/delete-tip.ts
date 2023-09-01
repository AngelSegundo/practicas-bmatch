import { TipRepository } from "../../repositories";

export interface DeleteTipUseCaseInput {
  id: string;
}
export interface DeleteTipUseCase {
  execute(input: DeleteTipUseCaseInput): Promise<void>;
}

export interface DeleteTipUseCaseProps {
  tipRepository: TipRepository;
}

export class DeleteTipUseCaseImpl implements DeleteTipUseCase {
  tipRepository: TipRepository;
  constructor(props: DeleteTipUseCaseProps) {
    this.tipRepository = props.tipRepository;
  }

  async execute(input: DeleteTipUseCaseInput): Promise<void> {
    const {  id } = input;
    return this.tipRepository.deleteTip(id);
  }
}
