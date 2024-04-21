import { Controller } from '@nestjs/common';
import { FamilyService } from './family.service';

@Controller({
  path: 'family',
  version: '1',
})
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}
}
