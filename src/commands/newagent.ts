import { ApplicationCommandOptionType } from 'discord.js';
import { ChatInputCommand } from '../Client';

export default {
	enabled: true,
	data: {
		name: 'newagent',
		dmPermission: false,
		description: 'Envoie le lien du timeclock à l\'utilisateur',
		options: [
			{
				name: 'agent',
				description: 'Le nouvel agent',
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
	},
	async execute(client, interaction) {
		const user = interaction.options.getUser('agent', true);

		if (user.bot) return interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande sur un bot', ephemeral: true });

		user.send('Bienvenue au LSPD. Voici le lien du timeclock : https://timeclock.join-lspd.ovh/new_agent');

		interaction.reply({ content: 'L\'agent a été notifié', ephemeral: true });
	},
} satisfies ChatInputCommand;