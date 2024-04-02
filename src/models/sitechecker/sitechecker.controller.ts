import { Controller, Post, Query } from '@nestjs/common';
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
}
