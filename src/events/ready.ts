import { ActivityType, BaseApplicationCommandData, Events, REST, Routes } from 'discord.js';

import { Event } from '../Client';

const event: Event = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.logger.info(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);
		client.user.setActivity('faire du café ☕', { type: ActivityType.Competing });

		const rest = new REST().setToken(process.env.TOKEN);

		const cmds: BaseApplicationCommandData[] = [];

		client.commands.map((item) => {
			cmds.push(item.data);
		});

		client.contextMenus.map((item) => {
			cmds.push(item.data);
		});


		client.guilds.cache.forEach(async (guild) => {
			try {
				client.logger.info(`Started refreshing ${cmds.length} application commands for ${guild.name}`);

				// The put method is used to fully refresh all commands in the guild with the current set
				const cmdData = await rest.put(
					Routes.applicationGuildCommands(client.user.id, guild.id),
					{ body: cmds },
				) as unknown[];

				client.logger.info(`Successfully reloaded ${cmdData.length} application commands`);
			}
			catch (error) {
				client.logger.error(error);
			}
		});
	},
};

export default event;