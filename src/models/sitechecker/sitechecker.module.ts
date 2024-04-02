import { Module } from '@nestjs/common';
import { SitecheckerService } from './sitechecker.service';
import { SitecheckerController } from './sitechecker.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SitecheckerController],
  providers: [SitecheckerService],
})
export class SitecheckerModule {}
