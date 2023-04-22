import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Interaction, TextChannel, GatewayIntentBits, GuildMember } from 'discord.js';
import { ApplicationCommandOptionType, APIApplicationCommandOption, APIGuildMember } from 'discord-api-types/v9';
import { PingHandler } from './commands/ping.handler';
import { CheckRoleHandler } from './commands/checkrole.handler';
import { Role, rolePermissions } from '../roles';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private allowedChannelIds: string[];
  private allowedCommandsList: string[];
  private commandName: string;

  constructor(
    private configService: ConfigService,
    private pingHandler: PingHandler,
    private checkRoleHandler: CheckRoleHandler,
  ) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const allowedChannels = this.configService.get<string>('ALLOWED_CHANNEL_IDS');
    this.allowedChannelIds = allowedChannels.split(',').map(channelId => channelId.trim());
    const allowedCommands = this.configService.get<string>('ALLOWED_COMMANDS_LIST');
    this.allowedCommandsList = allowedCommands.split(',').map(channelId => channelId.trim());
  }

  async onModuleInit(): Promise<void> {
    const token = this.configService.get<string>('DISCORD_BOT_TOKEN');
    this.client.once('ready', () => {
      console.log('Discord bot is ready!');
    });

    this.client.on('interactionCreate', (interaction) => this.onInteractionCreate(interaction));

    await this.client.login(token);
    await this.registerSlashCommands();
  }

  private async onInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;
    if (!(interaction.channel instanceof TextChannel) || !this.allowedChannelIds.includes(interaction.channel.id) && !this.allowedCommandsList.includes(interaction.commandName)) {
      await interaction.reply({ content: 'Эта команда не доступна в этом канале.', ephemeral: true });
      return;
    }

    
    const commandName = interaction.commandName;
    const member = interaction.member;
  
  
    if (commandName === this.pingHandler.commandName) {
        if (this.hasPermissionForCommand(member, [Role.User, Role.Team, Role.Moderator, Role.Admin], commandName)) {
          await this.pingHandler.handle(interaction);
        } else {
          await interaction.reply({ content: 'У вас нет разрешения на использование этой команды.', ephemeral: true });
        }
    }
      
  
    if (commandName === this.checkRoleHandler.commandName) {
      if (this.hasPermissionForCommand(member, [Role.Team,  Role.Admin], commandName)) {
        const roleName = interaction.options.data[0].value as string;
        await this.checkRoleHandler.handle(interaction, roleName);
      } else {
        await interaction.reply({ content: 'У вас нет разрешения на использование этой команды.', ephemeral: true });
      }
    }
}


private hasPermissionForCommand(member: GuildMember | APIGuildMember | null | undefined, requiredRoles: Role[], requiredCommand: string): boolean {
    if (!member) return false;
  
    const memberRoles = member instanceof GuildMember ? member.roles.cache.map(role => role.name) : member.roles;
  
    for (const requiredRole of requiredRoles) {
      if (!Object.values(Role).includes(requiredRole)) {
        console.log(`Role ${requiredRole} does not exist`);
        continue;
      }
      if (memberRoles.some(memberRole => memberRole === requiredRole)) {
        console.log(`Role ${requiredRole} exist`);
        return true;
      }
    }
  
    return false;
  }
  

  

  

  private async registerSlashCommands(): Promise<void> {
    const applicationId = this.configService.get<string>('DISCORD_APPLICATION_ID');
    const guildId = this.configService.get<string>('DISCORD_GUILD_ID');

    const commandData = [
      {
        name: 'ping',
        description: 'Ответ с задержкой',
      },
      {
        name: 'register',
        description: 'Регистрация в системе RP-API',
      },
      {
        name: 'checkrole',
        description: 'Проверяет, есть ли у вас указанная роль',
        options: [
          {
            name: 'role',
            description: 'Название роли для проверки',
            type: ApplicationCommandOptionType.String,
            required: true,
          } as APIApplicationCommandOption,
        ],
      },
    ];

    await this.client.application.commands.set(commandData, guildId);

    console.log('Slash commands have been registered.');
  }  
  
}
