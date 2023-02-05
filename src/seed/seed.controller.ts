import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

import { SeedService } from './seed.service';

@ApiTags('Seed Data Dummie')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  //s@Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
