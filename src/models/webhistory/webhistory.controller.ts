import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
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

  @Post('/sync')
  async syncWebhistory(
    @Req() req,
    @Body(new ZodPipe(WebHistorySyncZSchemaArray))
    payload: WebHistorySyncInputDto[],
  ) {
    const user = req?.user;
    Promise.allSettled(
      payload.map((item) => this.webhistoryService.syncWebhistory(user, item)),
    ).catch((e) => {
      this.logger.error(
        `error syncing User: ${JSON.stringify(
          user,
        )} webhistory: ${JSON.stringify(e)}`,
      );
    });
  }
}
