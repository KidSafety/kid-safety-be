import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebHistorySyncInputDto } from './types/web.history.sync.input.dto';

@Injectable()
export class WebhistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getWebHistoryList(user: User) {
    return await this.prismaService.chromeWebHistory.findMany({
      where: {
        userId: user.id,
      },
      take: 100, // depending on the user's plan
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async syncWebhistory(user: User, data: WebHistorySyncInputDto[]) {
    const chromeWebHistoryInputs: Prisma.ChromeWebHistoryCreateManyInput[] =
      data.map((item) => ({
        itemId: item.id,
        url: item.url,
        title: item.title,
        score: 0,
        category: 'unknown',
        lastVisitTime: new Date(item.lastVisitTime),
        visitCount: item.visitCount,
        typedCount: 0,
        duration: 0,
        userId: user.id,
      }));

    return await this.prismaService.chromeWebHistory.createMany({
      data: chromeWebHistoryInputs,
      skipDuplicates: true,
    });
  }
}
