import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUser(data: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findFirst(data);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
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
}
