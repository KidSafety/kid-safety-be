import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_CACHE_TIME } from './constants';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private prisma: PrismaService,
  ) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUser(data: Prisma.UserFindUniqueArgs): Promise<User | null> {
    const userCache = await this.redisClient.get(
      `user:email:${data.where.email}`,
    );
    if (userCache) return JSON.parse(userCache);
    const user = await this.prisma.user.findFirst(data);
    if (!user) return null;
    this.redisClient.set(
      `user:email:${user.email}`,
      JSON.stringify(user),
      'EX',
      USER_CACHE_TIME,
    );
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const userCache = await this.redisClient.get(`user:id:${id}`);
    if (userCache) return JSON.parse(userCache);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    this.redisClient.set(
      `user:id:${id}`,
      JSON.stringify(user),
      'EX',
      USER_CACHE_TIME,
    );
    return user;
  }

  /**
   * This method will be move to Application server - quickly add it here for the moment
   * Also use raw queries for not having to generate unnecessary models in this Auth server
   * It count number of items in each given table
   * @param tableNames string[]
   * @returns { tableName: count }
   */
  async countUserItems(
    userId: string,
    tableNames: string[],
  ): Promise<Record<string, number>> {
    const result = {};

    await Promise.all(
      tableNames.map(async (name) => {
        const dataResponse = await this.prisma
          .$queryRaw`SELECT COUNT(*) AS totalItem FROM ${Prisma.raw(
          name,
        )} WHERE userId = ${userId}`;
        result[name] = Number(dataResponse[0].totalItem);
      }),
    );

    return result;
  }

  async changePassword(userId: string, newPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { managerPassword: newPassword },
    });
  }
}
