import { generateKsuid } from "../utilities/ids";
import { Sponsor, SPONSOR_ID_PREFIX, SponsorDTO } from "../entities/sponsor";
import { DataSource } from "../interfaces";

export interface SponsorRepository {
  getSponsors(): Promise<SponsorDTO[]>;
  getSponsorById(id: string): Promise<SponsorDTO>;
  createSponsor(data: Sponsor): Promise<SponsorDTO>;
  updateSponsor(data: Partial<Sponsor>, id: string): Promise<SponsorDTO>;
}

export class SponsorRepositoryImpl implements SponsorRepository {
  dataSource: DataSource<SponsorDTO>;
  constructor(dataSource: DataSource<SponsorDTO>) {
    this.dataSource = dataSource;
  }

  getSponsors(): Promise<SponsorDTO[]> {
    return this.dataSource.getAll();
  }

  getSponsorById(id: string): Promise<SponsorDTO> {
    return this.dataSource.getById(id);
  }

  createSponsor(data: Sponsor): Promise<SponsorDTO> {
    const datetime = new Date().toISOString();
    const sponsor = {
      ...data,
      id: generateKsuid(SPONSOR_ID_PREFIX),
      createdAt: datetime,
      updatedAt: datetime,
    } as SponsorDTO;
    return this.dataSource.create(sponsor);
  }

  async updateSponsor(data: Partial<Sponsor>, id: string): Promise<SponsorDTO> {
    const datetime = new Date().toISOString();
    const sponsor = data as Partial<SponsorDTO>;
    sponsor.updatedAt = datetime;
    return this.dataSource.update(id, sponsor);
  }
}
