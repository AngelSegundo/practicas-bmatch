import { Insight, InsightDTO, INSIGHTS_ID_PREFIX } from "../entities";
import { DataSource } from "../interfaces";
import { generateKsuid } from "../utilities/ids";

export interface InsightRepository {
  getInsights(): Promise<InsightDTO[]>;
  getInsightById(id: string): Promise<InsightDTO>;
  createInsight(data: Insight): Promise<InsightDTO>;
  updateInsight(data: Partial<Insight>, id: string): Promise<InsightDTO>;
}
export class InsightRepositoryImpl implements InsightRepository {
  dataSource: DataSource<InsightDTO>;
  constructor(dataSource: DataSource<InsightDTO>) {
    this.dataSource = dataSource;
  }
  getInsights(): Promise<InsightDTO[]> {
    return this.dataSource.getAll();
  }
  getInsightById(id: string): Promise<InsightDTO> {
    return this.dataSource.getById(id);
  }
  async createInsight(data: Insight): Promise<InsightDTO> {
    const datetime = new Date().toISOString();
    const insight = {
      ...data,
      id: generateKsuid(INSIGHTS_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as InsightDTO;
    return this.dataSource.create(insight);
  }
  async updateInsight(data: Partial<Insight>, id: string): Promise<InsightDTO> {
    const datetime = new Date().toISOString();
    const insight = data as Partial<InsightDTO>;
    insight.updatedAt = datetime;
    return this.dataSource.update(id, insight);
  }
}
