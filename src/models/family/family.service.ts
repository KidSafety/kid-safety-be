import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FamilyRepository } from './family.repository';

@Injectable()
export class FamilyService {
  private readonly logger = new Logger(FamilyService.name);
  constructor(private readonly familyRepository: FamilyRepository) {}

  async joinFamilyByParentEmail(userId: string, parentEmail: string) {
    const parent = await this.familyRepository.getParentByEmail(parentEmail);
    if (!parent) throw new BadRequestException('Parent not found');
    const isUserHasParent = await this.familyRepository.checkIsUserHasFamily(
      userId,
    );
    if (isUserHasParent)
      throw new BadRequestException('User already has family');
    const isUserInFamily = await this.familyRepository.checkIsUserInFamily(
      userId,
      parent.id,
    );
    if (isUserInFamily) throw new BadRequestException('User already in family');
    try {
      await this.familyRepository.joinFamilyByParentId(userId, parent.id);
    } catch (error) {
      console.error(`Join family failed`, error);
      this.logger.error(`Join family failed`, error);
      throw new BadRequestException('Join family failed');
    }
  }

  async removeUserFromFamily(userId: string, parentId: string) {
    if (!this.familyRepository.checkIsUserInFamily(userId, parentId)) {
      throw new BadRequestException('User not in family');
    }
    try {
      await this.familyRepository.removeUserFromFamily(userId, parentId);
    } catch (error) {
      console.error(`Remove user from family failed`, error);
      this.logger.error(`Remove user from family failed`, error);
      throw new BadRequestException('Remove user from family failed');
    }
  }
}
