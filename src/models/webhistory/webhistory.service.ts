import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebHistorySyncInputDto } from './types/web.history.sync.input.dto';

@Injectable()
export class WebhistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async syncWebhistory(user: User, data: WebHistorySyncInputDto) {
    const chromeWebHistoryInput = {
      where: {
        itemId: data.id,
      },
      create: {
        itemId: data.id,
        url: data.url,
        title: data.title,
        score: 0,
        category: 'unknown',
        lastVisitTime: new Date(data.lastVisitTime),
        visitCount: data.visitCount,
        typedCount: 0,
        duration: 0,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
      update: {
        url: data.url,
        title: data.title,
        lastVisitTime: new Date(data.lastVisitTime),
        visitCount: data.visitCount,
      },
    } as unknown as Prisma.ChromeWebHistoryUpsertArgs;

    return await this.prismaService.chromeWebHistory.upsert(
      chromeWebHistoryInput,
    );
  }
}
