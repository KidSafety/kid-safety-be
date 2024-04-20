import { BadRequestException, Injectable } from '@nestjs/common';
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
    const user = await this.repository.findUserById(userId);
    delete user.managerPassword;
    return user;
  }

  async generateUser(userId?: string, email?: string): Promise<User> {
    const user = await this.repository.findUser({ where: { email } });
    if (user) return user;
    const existingUserWithUserId = await this.repository.findUserById(userId);
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

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.repository.findUserById(userId, false);
    if (!user.managerPassword) {
      throw new BadRequestException('Password not set');
    } else if (
      user.managerPassword &&
      user.managerPassword !== currentPassword
    ) {
      throw new BadRequestException('Invalid password');
    } else {
      await this.repository.changePassword(userId, newPassword);
      return true;
    }
  }

  async setFirstTimePassword(userId: string, newPassword: string) {
    const user = await this.repository.findUserById(userId, false);
    if (user?.managerPassword) {
      throw new BadRequestException('Password already set');
    } else {
      await this.repository.changePassword(userId, newPassword);
      return true;
    }
  }
}
