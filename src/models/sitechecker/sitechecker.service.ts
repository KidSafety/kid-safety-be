import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class SitecheckerService {
  constructor() {}

  async addBulkSites(source: string) {
    // 1. Get the list of sites from the source
    const response = await axios.get(source).then((res) => res.data);
    return response;
    // 2. Add the sites to the database
  }

  async addSite() {}

  async addBulkCustomSites() {}

  async addCustomSite() {}

  async getCustomSiteList() {}

  async getSite(url: string) {}

  async searchSite(url: string) {}

  async deleteSite(url: string) {}
}
