import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  url: string;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.getOrThrow<string>('REDIS_URL');
  }
  async createRedisOptions(): Promise<RedisModuleOptions> {
    return {
      config: {
        url: this.url,
      },
    };
  }
}
