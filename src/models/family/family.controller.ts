import { Controller, Post } from '@nestjs/common';
import { FamilyService } from './family.service';

@Controller({
  path: 'family',
  version: '1',
})
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post('join')
  async joinFamilyByParentEmail(userId: string, parentEmail: string) {
    if (!userId || !parentEmail) throw new Error('Invalid input');
    return await this.familyService.joinFamilyByParentEmail(
      userId,
      parentEmail,
    );
  }

  @Post('remove')
  async removeUserFromFamily(userId: string, parentId: string) {
    if (!userId || !parentId) throw new Error('Invalid input');
    return await this.familyService.removeUserFromFamily(userId, parentId);
  }
}
