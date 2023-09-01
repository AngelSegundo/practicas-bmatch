import { Tip, TipDTO, TIP_ID_PREFIX } from "../entities";
import { DataSource } from "../interfaces";
import { generateKsuid } from "../utilities/ids";

export interface TipRepository {
  getTips(): Promise<TipDTO[]>;
  getTipById(id: string): Promise<TipDTO>;
  createTip(data: Tip): Promise<TipDTO>;
  updateTip(data: Partial<Tip>, id: string): Promise<TipDTO>;
  deleteTip(id: string): Promise<void>;
}
export class TipRepositoryImpl implements TipRepository {
  
  dataSource: DataSource<TipDTO>;
  constructor(dataSource: DataSource<TipDTO>) {
    this.dataSource = dataSource;
  }
  
  getTips(): Promise<TipDTO[]> {
    return this.dataSource.getAll();
  }
  
  getTipById(id: string): Promise<TipDTO> {
    return this.dataSource.getById(id);
  }
  
  async createTip(data: Tip): Promise<TipDTO> {
    const datetime = new Date().toISOString();
    const tip = {
      ...data,
      id: generateKsuid(TIP_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as TipDTO;
    return this.dataSource.create(tip);
  }
  
  async updateTip(data: Partial<Tip>, id: string): Promise<TipDTO> {
    const datetime = new Date().toISOString();
    const tip = data as Partial<TipDTO>;
    tip.updatedAt = datetime;
    return this.dataSource.update(id, tip);
  }
  
  // delete tip
  async deleteTip(id: string): Promise<void> {
    return this.dataSource.delete(id);
  }
}
