import { Module } from '@nestjs/common';
import { SitecheckerService } from './sitechecker.service';
import { SitecheckerController } from './sitechecker.controller';

@Module({
  controllers: [SitecheckerController],
  providers: [SitecheckerService],
})
export class SitecheckerModule {}
