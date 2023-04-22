import { Injectable } from '@nestjs/common';
import { CommandInteraction, GuildMember } from 'discord.js';

@Injectable()
export class CheckRoleHandler {
  commandName = 'checkrole';

  async handle(interaction: CommandInteraction, roleName: string): Promise<void> {
    const member = interaction.member as GuildMember;
    if (this.hasRole(member, roleName)) {
      await interaction.reply(`У вас есть роль ${roleName}.`);
    } else {
      await interaction.reply(`У вас нет роли ${roleName}.`);
    }
  }

  private hasRole(member: GuildMember, roleName: string): boolean {
    return member.roles.cache.some(role => role.name.toLowerCase() === roleName.toLowerCase());
  }
}
