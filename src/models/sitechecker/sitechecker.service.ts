import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { chunk } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractDnsAndDomain } from './utils';

@Injectable()
export class SitecheckerService {
  private readonly logger = new Logger(SitecheckerService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async addBulkSites(source: string): Promise<boolean> {
    try {
      // 1. Get the list of sites from the source
      const fileContent = await axios.get(source).then((res) => res.data);

      // 2. Parse the file
      const { category, data } = extractDnsAndDomain(fileContent);

      // 3. Divide data into chunks of 5000 sites at a time
      const dataChunks = chunk(data, 4000);
      const totalChunks = dataChunks.length;

      console.log(`Total chunks: ${totalChunks}`);

      // 4. Add the sites to the database in chunks
      let currentChunk = 0;
      for (const chunk of dataChunks) {
        currentChunk++;
        console.log(`Processing chunk ${currentChunk} of ${totalChunks}`);
        const siteBlackListInputs = chunk.map((site) => ({
          url: site.domain,
          dns: site.dns,
          category,
        }));
        await this.prismaService.siteBlackList.createMany({
          data: siteBlackListInputs,
          skipDuplicates: true,
        });
      }

      // Return true if everything succeeds
      console.log('All sites added successfully');
      return true;
    } catch (error) {
      this.logger.error(`Error adding bulk sites`, error);
      throw new BadRequestException('Error adding bulk sites');
    }
  }

  async addSite() {}

  async addBulkCustomSites() {}

  async addCustomSite() {}

  async getCustomSiteList() {}

  async getSite(url: string) {}

  async searchSite(url: string) {}

  async deleteSite(url: string) {}
}
