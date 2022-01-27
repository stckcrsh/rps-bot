import axios from 'axios';
import { MessageActionRow, MessageButton } from 'discord.js';

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function updateMessage(
  message: any,
  messageId: string,
  channelId: string
): Promise<void> {
  await axios({
    method: 'post',
    url: `http://localhost:3333/api/stuff/edit`,
    data: {
      channelId,
      messageId,
      message,
    },
  });
}

export async function getRow() {
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`id:rock`)
      .setLabel('Rock')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(`id:paper`)
      .setLabel('Paper')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(`id:scissors`)
      .setLabel('Scissors')
      .setStyle('PRIMARY')
  );
  console.log(row.toJSON())
  return row.toJSON();
}
