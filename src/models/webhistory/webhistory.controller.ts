import { Controller } from '@nestjs/common';
import { WebhistoryService } from './webhistory.service';

@Controller('webhistory')
export class WebhistoryController {
  constructor(private readonly webhistoryService: WebhistoryService) {}
}
