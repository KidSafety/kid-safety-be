import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyRepository } from './family.repository';
import { FamilyService } from './family.service';

@Module({
  controllers: [FamilyController],
  providers: [FamilyService, FamilyRepository],
})
export class FamilyModule {}
