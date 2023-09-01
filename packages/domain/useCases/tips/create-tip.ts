import { Tip, TipDTO } from "../../entities";
import { TipRepository } from "../../repositories/tip-repository";

export interface CreateTipUseCase {
  execute(data: Tip): Promise<TipDTO>;
}

export class CreateTipUseCaseImpl implements CreateTipUseCase {
  tipRepository: TipRepository;
  constructor(tipRepository: TipRepository) {
    this.tipRepository = tipRepository;
  }

  async execute(data: Tip): Promise<TipDTO> {
    return this.tipRepository.createTip(data);
  }
}
