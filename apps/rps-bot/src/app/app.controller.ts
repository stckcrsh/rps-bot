import { Body, Controller, Post } from '@nestjs/common';
import { DiscordClientProvider, On } from 'discord-nestjs';
import { BaseCommandInteraction, Message, MessageActionRow, MessageButton, TextChannel } from 'discord.js';

class MessageDTO {
  message: string;
}

class UpdateMessage {
  message: any;
  messageId: string;
  channelId: string;
}

@Controller('stuff')
export class AppController {
  constructor(private readonly discordProvider: DiscordClientProvider) {}

  @Post()
  async create(@Body() messageDTO: MessageDTO) {
    const channel = (await this.discordProvider
      .getClient()
      .channels.fetch('748351850050486426')) as TextChannel;
      const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('the include button')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
    const id = await channel.send({content:messageDTO.message, components:[row]});
    console.log(id);
  }

  @Post('edit')
  async edit(@Body() { channelId, messageId, message }: UpdateMessage) {
    const channel = (await this.discordProvider
      .getClient()
      .channels.fetch(channelId)) as TextChannel;
    const msg = await channel.messages.fetch(messageId);
    msg.edit(message)
  }
}
