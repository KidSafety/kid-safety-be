import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { WebhistoryModule } from './models/webhistory/webhistory.module';
import { AccountModule } from './models/account/account.module';

@Module({
  imports: [UsersModule, WebhistoryModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
