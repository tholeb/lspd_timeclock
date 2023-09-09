import { ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { ContextMenuUserCommand } from '@/Client';
import Config from '@/models/Config';
import Shift from '@/models/Shifts';
import moment from 'moment';

export default {
	enabled: true,
	data: {
		name: 'Prise/fin de service',
		type: ApplicationCommandType.User,
		dmPermission: false,
	},
	async execute(client, interaction) {
		if (!interaction.inCachedGuild()) {
			await interaction.reply({ content: 'Cette commande ne peut pas être utilisée en message privé', ephemeral: true });
			return;
		}

		if (interaction.targetUser.bot) {
			await interaction.reply({ content: 'Un bot ne peut pas prendre son service', ephemeral: true });
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		const hasPermission = interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has(PermissionFlagsBits.ManageRoles);

		if (!hasPermission && interaction.targetUser.id !== interaction.user.id) {
			await interaction.editReply({ content: 'Vous ne pouvez pas prendre le début/fin de service de quelqu\'un d\'autre' });
			return;
		}

		const config = await Config.findOne({ where: { guildId: interaction.guild?.id, key: 'serviceRole' } });


		let role = interaction.guild?.roles.cache.find(r => r.name.toLowerCase().includes('service'));
		if (config?.getDataValue('value')) {
			role = interaction.guild?.roles.cache.get(config?.getDataValue('value'));
		}

		if (!role) {
			client.logger.info('No role named "service" found, creating one !');

			role = await interaction.guild?.roles.create({
				name: 'En service',
				color: 'Random',
				hoist: true,
				reason: 'Création du rôle "service" puisqu\'il était manquant',
			});

			if (!role) {
				await interaction.editReply({ content: 'Une erreur est survenue lors de la création du rôle "service"' });
				return;
			}

			await Config.upsert({
				guildId: interaction.guild?.id,
				key: 'serviceRole',
				value: role?.id,
				modifierId: client.user.id,
			});
		}

		const userRoles = interaction.guild?.members.cache.get(interaction.targetUser.id)?.roles.cache;

		if (role && !userRoles?.has(role?.id)) {
			await Shift.create({
				userId: interaction.targetUser.id,
				weekNumber: moment().week().toString(),
				start: moment().toISOString(),
			});

			await interaction.guild?.members.cache.get(interaction.targetUser.id)?.roles.add(role, 'Début de service');
			await interaction.editReply({ content: 'Vous êtes maintenant en service' });

			return;
		}

		const lastShift = await Shift.findOne({
			where: {
				userId: interaction.targetUser.id,
				end: null,
			},
		});

		if (!lastShift) {
			await interaction.guild?.members.cache.get(interaction.targetUser.id)?.roles.remove(role, 'Fin de service');
			await interaction.editReply({ content: 'Vous n\'êtes plus en service, mais je n\'ai pas trouvé votre dernier shift.' });

			return;
		}

		lastShift?.update({
			end: moment().toISOString(),
		});

		await interaction.guild?.members.cache.get(interaction.targetUser.id)?.roles.remove(role, 'Fin de service');
		await interaction.editReply({ content: 'Vous n\'êtes plus en service' });

	},
} satisfies ContextMenuUserCommand;