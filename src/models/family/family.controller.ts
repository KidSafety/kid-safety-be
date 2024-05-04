import { Body, Controller, Post, Req } from '@nestjs/common';
import { ZodPipe } from '../auth/pipe/zod.pipe';
import { JoinFamilyDto, JoinFamilyZSchema } from './dtos/join.family.dto';
import {
  RemoveFromFamilyDto,
  RemoveFromFamilyZSchema,
} from './dtos/remove.from.family.dto';
import { FamilyService } from './family.service';

@Controller({
  path: 'family',
  version: '1',
})
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post('join')
  async joinFamilyByParentEmail(
    @Req() req,
    @Body(new ZodPipe(JoinFamilyZSchema))
    payload: JoinFamilyDto,
  ) {
    const userId = req.user.id;
    const parentEmail = payload.parentEmail;
    if (!userId || !parentEmail) throw new Error('Invalid input');
    return await this.familyService.joinFamilyByParentEmail(
      userId,
      parentEmail,
    );
  }

  @Post('remove')
  async removeUserFromFamily(
    @Req() req,
    @Body(new ZodPipe(RemoveFromFamilyZSchema))
    payload: RemoveFromFamilyDto,
  ) {
    const userId = req.user.id;
    const parentId = payload.parentId;
    if (!userId || !parentId) throw new Error('Invalid input');
    return await this.familyService.removeUserFromFamily(userId, parentId);
  }
}
