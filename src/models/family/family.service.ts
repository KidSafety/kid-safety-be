import { BadRequestException, Injectable } from '@nestjs/common';
import { FamilyRepository } from './family.repository';

@Injectable()
export class FamilyService {
  constructor(private readonly familyRepository: FamilyRepository) {}

  async joinFamilyByParentEmail(userId: string, parentEmail: string) {
    const parent = await this.familyRepository.getParentByEmail(parentEmail);
    if (!parent) throw new BadRequestException('Parent not found');
    const isUserHasParent = this.familyRepository.checkIsUserHasFamily(userId);
    if (isUserHasParent)
      throw new BadRequestException('User already has family');
    const isUserInFamily = this.familyRepository.checkIsUserInFamily(
      userId,
      parent.id,
    );
    if (isUserInFamily) throw new BadRequestException('User already in family');

    await this.familyRepository.joinFamilyByParentId(userId, parent.id);
  }

  async removeUserFromFamily(userId: string, parentId: string) {
    if (!this.familyRepository.checkIsUserInFamily(userId, parentId)) {
      throw new BadRequestException('User not in family');
    }
    await this.familyRepository.removeUserFromFamily(userId, parentId);
  }
}
