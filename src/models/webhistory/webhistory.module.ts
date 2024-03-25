import { Module } from '@nestjs/common';
import { WebhistoryService } from './webhistory.service';
import { WebhistoryController } from './webhistory.controller';

@Module({
  controllers: [WebhistoryController],
  providers: [WebhistoryService],
})
export class WebhistoryModule {}
