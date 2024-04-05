import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import { ZodPipe } from '../auth/pipe/zod.pipe';
import {
  AddSiteBlackListDto,
  AddSiteBlackListZSchema,
} from './dtos/add.site.blacklist.dto';
import { SitecheckerService } from './sitechecker.service';

@Controller({
  path: 'sitechecker',
  version: '1',
})
export class SitecheckerController {
  constructor(private readonly sitecheckerService: SitecheckerService) {}

  @Post('addBulkSites')
  async addBulkSites(@Query() query: any) {
    const source = query.source;
    return this.sitecheckerService.addBulkSites(source);
  }

  @Post('/blacklist/add')
  async addBlackList(
    @Req() req,
    @Body(new ZodPipe(AddSiteBlackListZSchema)) payload: AddSiteBlackListDto,
  ) {
    const user = req?.user;
    return this.sitecheckerService.addBlackList(user, payload);
  }

  @Post('/isBlocked')
  async isSiteBlocked(@Req() req, @Body() payload: any) {
    const url = payload.url;
    const user = req?.user;
    return this.sitecheckerService.isSiteBlocked(user, url);
  }
}
