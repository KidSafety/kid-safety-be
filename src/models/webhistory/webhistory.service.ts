import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhistoryService {
  async syncWebhistory(data: any) {
    console.log('syncWebhistory::', data);
  }
}
