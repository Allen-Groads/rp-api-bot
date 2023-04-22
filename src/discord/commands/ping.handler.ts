import { Injectable } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';

@Injectable()
export class PingHandler {
  commandName = 'ping';

  async handle(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  }
}