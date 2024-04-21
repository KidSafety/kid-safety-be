import { User } from '@prisma/client';

export abstract class IFamilyRepository {
  abstract getParentByEmail(email: string): Promise<User | null>;

  abstract checkIsUserHasFamily(userId: string): Promise<boolean>;

  abstract checkIsUserInFamily(
    userId: string,
    parentId: string,
  ): Promise<boolean>;

  abstract joinFamilyByParentId(
    userId: string,
    parentId: string,
  ): Promise<void>;

  abstract removeUserFromFamily(
    userId: string,
    parentId: string,
  ): Promise<void>;

  abstract getFamilyMembers(parentId: string): Promise<User[]>;
}
