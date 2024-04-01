import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async findUser(data: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return await this.repository.findUser(data);
  }

  async getUserById(userId: any) {
    return await this.repository.findUserById(userId);
  }

  async generateUser(userId?: string, email?: string): Promise<User> {
    const user = await this.repository.findUser({ where: { email } });
    if (user) return user;
    const existingUserWithUserId = await this.repository.findUser({
      where: { id: userId },
    });
    if (existingUserWithUserId && !user) userId = uuid();
    else userId = userId || uuid();
    return await this.repository.createUser({
      id: userId,
      email,
    });
  }

  async countUserItems(
    userId: string,
    tableNames: string[],
  ): Promise<Record<string, number>> {
    return this.repository.countUserItems(userId, tableNames);
  }
}
