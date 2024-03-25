import { Body, Controller, Post } from '@nestjs/common';
import { WebhistoryService } from './webhistory.service';

@Controller({
  path: 'webhistory',
  version: '1',
})
export class WebhistoryController {
  constructor(private readonly webhistoryService: WebhistoryService) {}

  @Post('/sync')
  async syncWebhistory(@Body() payload: any) {
    return this.webhistoryService.syncWebhistory(payload);
  }
}
