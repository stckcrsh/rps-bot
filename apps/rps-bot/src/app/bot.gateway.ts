import { Injectable, Logger } from '@nestjs/common';
import { Once, DiscordClientProvider, On, OnCommand } from 'discord-nestjs';
import { WorkflowService } from './workflow.service';

import {
  BaseCommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import {
  getPlayersQuery,
  getToThrowMessageQuery,
  newPlayerSignal,
  RPS,
} from '@rps-bot/workflows/workflows';
import { setMessageInfoSignal, playerThrowsSignal } from '../../../../libs/workflows/src/workflows';

const INCLUDE_BUTTON = 'the include button';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    private readonly discordProvider: DiscordClientProvider,
    private readonly workflowService: WorkflowService
  ) {}

  @Once({ event: 'ready' })
  onReady(): void {
    this.logger.log(
      `Logged in as ${this.discordProvider.getClient().user.tag}!`
    );
  }

  @OnCommand({ name: 'start' })
  async onCommand(command: Message): Promise<void> {
    const handle = await this.workflowService.client.start(RPS, {
      args: [],
      taskQueue: 'tutorial',
      workflowId: command.id,
    });
    console.log(`Started workflow ${handle.workflowId}`);

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`${INCLUDE_BUTTON}:${handle.workflowId}`)
        .setLabel('Join')
        .setStyle('PRIMARY')
    );
    const message = await command.reply({ content: 'Join', components: [row] });
    handle.signal(setMessageInfoSignal, {
      messageId: message.id,
      channelId: command.channel.id,
    });
  }

  @On({ event: 'interactionCreate' })
  async buttonClick(interaction: BaseCommandInteraction): Promise<void> {
    if (!interaction.isButton()) return;
    if (interaction.customId.startsWith(INCLUDE_BUTTON)) {
      const [, workflowId] = interaction.customId.split(':');
      const handle = this.workflowService.client.getHandle(workflowId);
      handle.signal(newPlayerSignal, interaction.user.username);

      const players = await handle.query(getPlayersQuery);
      await interaction.update({
        content: `Current Players: ${players.join(', ')}`,
      });
    }

    if(interaction.customId.startsWith('Throw')) {
      const [, workflowId, throws] = interaction.customId.split(':');
      const handle = this.workflowService.client.getHandle(workflowId);
      // @ts-ignore
      handle.signal(playerThrowsSignal, {player: interaction.user.username, throws});
      const message = await handle.query(getToThrowMessageQuery)
      await interaction.update({
        content: message,
      });
    }
    console.log(interaction);
  }
}
