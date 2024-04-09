import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import axios from 'axios';
import { chunk } from 'lodash';
import { SearchQueryDto } from 'src/common/dtos/search.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSiteBlackListDto } from './dtos/add.site.blacklist.dto';
import { AddSiteWhiteListDto } from './dtos/add.site.whitelist.dto';
import { extractDnsAndDomain, extractDomainFromUrl } from './utils';

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

  async addBlackList(user: User, payload: AddSiteBlackListDto) {
    try {
      const domain = extractDomainFromUrl(payload.url);
      const site = await this.getCustomSite(user, domain);
      if (site && site.isBlocked) return true;
      if (site && !site.isBlocked) {
        await this.prismaService.customSite.update({
          where: {
            CustomSiteUrlUserIdUniqueIndex: {
              userId: user.id,
              domain,
            },
          },
          data: {
            isBlocked: true,
          },
        });
        return true;
      }
      await this.prismaService.customSite.create({
        data: {
          category: payload.category,
          url: payload.url,
          domain: domain,
          userId: user.id,
          isBlocked: true,
        },
      });
      return true;
    } catch (error) {
      this.logger.error(`Error adding blacklist site`, error);
      throw new BadRequestException('Error adding blacklist site');
    }
  }

  async addWhiteList(user: User, payload: AddSiteWhiteListDto) {
    try {
      const domain = extractDomainFromUrl(payload.url);
      const site = await this.getCustomSite(user, domain);
      if (site) {
        await this.prismaService.customSite.update({
          where: {
            CustomSiteUrlUserIdUniqueIndex: {
              userId: user.id,
              domain,
            },
          },
          data: {
            isBlocked: false,
          },
        });
        return true;
      }
      await this.prismaService.customSite.create({
        data: {
          url: payload.url,
          domain: domain,
          userId: user.id,
          isBlocked: false,
        },
      });
      return true;
    } catch (error) {
      this.logger.error(`Error adding blacklist site`, error);
      throw new BadRequestException('Error adding blacklist site');
    }
  }

  private async getCustomSite(user: User, domain: string) {
    const site = await this.prismaService.customSite.findUnique({
      where: {
        CustomSiteUrlUserIdUniqueIndex: {
          domain,
          userId: user.id,
        },
      },
    });
    return site;
  }

  async isSiteBlocked(user: User, url: string) {
    this.logger.log(`user ${user.id} Checking if site is blocked ${url}`);
    const domain = extractDomainFromUrl(url);
    this.logger.log(`Domain: ${domain}`);
    if (!domain) return false;
    const site = await this.getCustomSite(user, domain);
    if (!site) return false;
    return site?.isBlocked;
  }

  async getCustomSiteList(user: User, query: SearchQueryDto) {
    try {
      const total = await this.prismaService.customSite.count({
        where: {
          userId: user.id,
          isBlocked: true,
        },
      });
      const sites = await this.prismaService.customSite.findMany({
        where: {
          userId: user.id,
          isBlocked: true,
        },
        skip: Number(query.skip),
        take: Number(query.limit),
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        total,
        sites,
      };
    } catch (error) {
      console.error(`Error listing custom blocked sites`, error);
      this.logger.error(`Error listing custom blocked sites`, error);
      throw new BadRequestException('Error listing custom blocked sites');
    }
  }

  async removeCustomBlackList(user: User, url: string) {
    try {
      const domain = extractDomainFromUrl(url);
      const checkSite = await this.getCustomSite(user, domain);
      if (!checkSite) return true;
      await this.prismaService.customSite.delete({
        where: {
          CustomSiteUrlUserIdUniqueIndex: {
            userId: user.id,
            domain,
          },
        },
      });
      return true;
    } catch (error) {
      console.error(`Error removing custom blacklist site`, error);
      this.logger.error(`Error removing custom blacklist site`, error);
      throw new BadRequestException('Error removing custom blacklist site');
    }
  }
}
