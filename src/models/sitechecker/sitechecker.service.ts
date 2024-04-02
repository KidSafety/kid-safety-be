import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { extractDnsAndDomain } from './utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class SitecheckerService {
  constructor(private readonly prismaService: PrismaService) {}

  async addBulkSites(source: string): Promise<boolean> {
    // 1. Get the list of sites from the source
    const file = await axios.get(source).then((res) => res.data);
    // 2. Parse the file
    const { category, data } = extractDnsAndDomain(file);
    // 3. Add the sites to the database
    await Promise.all(
      data.map(async (site) => {
        const siteBlackListInput = {
          where: { url: site.domain },
          create: {
            url: site.domain,
            dns: site.dns,
            category,
          },
          update: {
            url: site.domain,
            dns: site.dns,
            category: category,
          },
        } as Prisma.SiteBlackListUpsertArgs;
        await this.prismaService.siteBlackList.upsert(siteBlackListInput);
      }),
    );
    return true;
  }

  async addSite() {}

  async addBulkCustomSites() {}

  async addCustomSite() {}

  async getCustomSiteList() {}

  async getSite(url: string) {}

  async searchSite(url: string) {}

  async deleteSite(url: string) {}
}
