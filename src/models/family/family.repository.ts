import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFamilyRepository } from './family.abstract.usecase';

@Injectable()
export class FamilyRepository implements IFamilyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getParentByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async checkIsUserHasFamily(userId: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    return Boolean(user.managerId);
  }

  async checkIsUserInFamily(
    userId: string,
    parentId: string,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user?.managerId) return false;
    return user.managerId === parentId;
  }

  async joinFamilyByParentId(userId: string, parentId: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { managerId: parentId },
    });
  }

  async removeUserFromFamily(userId: string, parentId: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId, managerId: parentId },
      data: { managerId: null },
    });
  }

  getFamilyMembers(parentId: string): Promise<User[]> {
    return this.prismaService.user.findMany({ where: { managerId: parentId } });
  }
}
