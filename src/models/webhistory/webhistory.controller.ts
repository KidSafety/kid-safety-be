import { Body, Controller, Post, Req } from '@nestjs/common';
import { ZodPipe } from '../auth/pipe/zod.pipe';
import {
  WebHistorySyncInputDto,
  WebHistorySyncZSchema,
} from './types/web.history.sync.input.dto';
import { WebhistoryService } from './webhistory.service';

@Controller({
  path: 'webhistory',
  version: '1',
})
export class WebhistoryController {
  constructor(private readonly webhistoryService: WebhistoryService) {}

  @Post('/sync')
  async syncWebhistory(
    @Req() req,
    @Body(new ZodPipe(WebHistorySyncZSchema)) payload: WebHistorySyncInputDto,
  ) {
    const user = req?.user;
    return this.webhistoryService.syncWebhistory(user, payload);
  }
}
