import { Module } from '@nestjs/common';
import { DiscordModule, TransformPipe, ValidationPipe } from 'discord-nestjs';
import { Intents } from 'discord.js';

import { AppController } from './app.controller';
import { BotGateway } from './bot.gateway';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: 'OTMyODU2MDg4NzIwNzExNzEw.YeZD7w.-I8j71Y9S5hhBFIJ8ypLwxcfywI',
        commandPrefix: '%',
        // allowGuilds: ['748351850050486423'],
        // denyGuilds: [],
        // allowCommands: [
        //   {
        //     name: 'start',
        //     channels: ['745366352386326572'],
        //     users: ['261863053329563648'],
        //     channelType: ['dm'],
        //   },
        // ],
        // webhook: {
        //   webhookId: 'your_webhook_id',
        //   webhookToken: 'your_webhook_token',
        // },
        // usePipes: [TransformPipe, ValidationPipe],
        intents: [
          Intents.FLAGS.DIRECT_MESSAGES,
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILDS,
        ],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [BotGateway, WorkflowService],
})
export class AppModule {}
