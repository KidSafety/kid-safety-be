import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFamilyRepository } from './family.abstract.usecase';

@Injectable()
export class FamilyRepository implements IFamilyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getParentByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  checkIsUserHasFamily(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  checkIsUserInFamily(userId: string, parentId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  joinFamilyByParentId(userId: string, parentId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeUserFromFamily(userId: string, parentId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getFamilyMembers(parentId: string): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
