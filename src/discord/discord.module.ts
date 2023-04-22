import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from './discord.service';
import { PingHandler } from './commands/ping.handler';
import { CheckRoleHandler } from './commands/checkrole.handler';

@Module({
  imports: [
    ConfigModule, 
  ],
  providers: [
    DiscordService, 
    PingHandler, 
    CheckRoleHandler,
    ConfigService,
  ],
})
export class DiscordModule {}
