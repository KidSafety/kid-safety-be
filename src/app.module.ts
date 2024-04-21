import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './models/account/account.module';
import { AuthModule } from './models/auth/auth.module';
import { RedisConfigService } from './models/redis_cache/redis_config.service';
import { UsersModule } from './models/users/users.module';
import { WebhistoryModule } from './models/webhistory/webhistory.module';
import { SitecheckerModule } from './models/sitechecker/sitechecker.module';
import { FamilyModule } from './models/family/family.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.test'],
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
    AuthModule,
    UsersModule,
    WebhistoryModule,
    AccountModule,
    SitecheckerModule,
    FamilyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
