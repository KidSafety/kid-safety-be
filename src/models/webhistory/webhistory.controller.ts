import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { ZodPipe } from '../auth/pipe/zod.pipe';
import {
  WebHistorySyncInputDto,
  WebHistorySyncZSchemaArray,
} from './types/web.history.sync.input.dto';
import { WebhistoryService } from './webhistory.service';

@Controller({
  path: 'webhistory',
  version: '1',
})
export class WebhistoryController {
  private readonly logger = new Logger(WebhistoryController.name);
  constructor(private readonly webhistoryService: WebhistoryService) {}

  @Get('/list')
  async getWebHistoryList(@Req() req) {
    const user = req?.user;
    return await this.webhistoryService.getWebHistoryList(user);
  }

  @Post('/sync')
  async syncWebhistory(
    @Req() req,
    @Body(new ZodPipe(WebHistorySyncZSchemaArray))
    payload: WebHistorySyncInputDto[],
  ) {
    const user = req?.user;
    await this.webhistoryService.syncWebhistory(user, payload);
  }
}
