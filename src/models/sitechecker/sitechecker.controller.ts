import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ZodPipe } from '../auth/pipe/zod.pipe';
import {
  AddSiteBlackListDto,
  AddSiteBlackListZSchema,
} from './dtos/add.site.blacklist.dto';
import { SitecheckerService } from './sitechecker.service';
import {
  SearchQueryDto,
  SearchQueryZSchema,
} from 'src/common/dtos/search.query';

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

  @Get('/blacklist/custom')
  async getCustomSiteList(@Req() req, @Query() query: SearchQueryDto) {
    const user = req?.user;
    query = SearchQueryZSchema.parse(query);
    return this.sitecheckerService.getCustomSiteList(user, query);
  }

  @Delete('/blacklist/custom')
  async removeCustomBlackList(@Req() req, @Query() query: any) {
    const user = req?.user;
    const url = query.url;
    return this.sitecheckerService.removeCustomBlackList(user, url);
  }
}
