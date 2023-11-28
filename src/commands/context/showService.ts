import { ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import { ContextMenuUserCommand } from '@/Client';
import Shift from '@/models/Shifts';
import moment from 'moment';
import { createEmbed } from '@/func/EmbedCreator';
import Pager from '@/utils/Pager';

export default {
	enabled: true,
	data: {
		name: 'Lister les prises de service',
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
			await interaction.editReply({ content: 'Vous ne pouvez pas voir les prises de service de quelqu\'un d\'autre' });
			return;
		}

		const AllServices = await Shift.findAll({ where: { userId: interaction.targetUser.id } });

		if (AllServices.length === 0) {
			await interaction.editReply({ content: 'Aucun service n\'a été trouvé' });
			return;
		}

		moment.locale('fr');

		function getRandomInt(min: number, max: number) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min);
		}

		const day = getRandomInt(1, 14);

		if (process.env.NODE_ENV === 'dev') {
			const newDate = moment().add(day, 'day');
			console.log(newDate.toISOString(), newDate.week().toString());

			Shift.create({
				userId: interaction.targetUser.id,
				weekNumber: newDate.week().toString(),
				start: newDate.toISOString(),
				end: newDate.add(getRandomInt(1, 6), 'hours').toISOString(),
			});
		}

		const servicesByWeekNumber = AllServices.reduce((acc, service) => {
			const weekNumber = service.getDataValue('weekNumber');

			// If the week number doesn't exist in the accumulator, create an empty array for it
			if (!acc[weekNumber]) {
				// Use a type assertion to inform TypeScript about the type
				acc[weekNumber] = [] as Shift[];
			}

			// Push the service into the corresponding week's array
			acc[weekNumber].push(service);

			return acc;
		}, {} as Record<string, Shift[]>);

		const embeds = Object.entries(servicesByWeekNumber).map(([weekNumber, services]) => {
			const fields = services.map(service => {
				const start = moment(service.getDataValue('start'));
				const end = moment(service.getDataValue('end'));

				const startHour = start.format('HH[h]mm');
				let endHour = end.format('HH[h]mm');

				let duration = moment.utc(moment.duration(end.diff(start)).asMilliseconds()).format('HH[h]mm');

				if (endHour.toString() === 'Invalid date') {
					endHour = 'En cours';
					duration = 'En cours';
				}

				return {
					name: `${moment.weekdays()[start.day()]} ${moment(start).format('DD/MM/YYYY')}`,
					value: `${startHour} - ${endHour} (${duration})`,
				};
			});

			// Count all the hours
			const totalHours = services.reduce((acc, service) => {
				const start = moment(service.getDataValue('start'));
				const end = moment(service.getDataValue('end'));

				if (end.toString() === 'Invalid date') return acc;

				const duration = moment.duration(end.diff(start));

				return acc + duration.asMilliseconds();
			}, 0);

			const year = moment(services[0].getDataValue('start')).year();

			const firstDayOfTheWeek = moment().year(year).week(parseInt(weekNumber)).startOf('week');
			const lastDayOfTheWeek = moment().year(year).week(parseInt(weekNumber)).endOf('week');

			const embed = createEmbed(`Semaine n°${weekNumber} (${firstDayOfTheWeek.format('DD/MM/YYYY')} - ${lastDayOfTheWeek.format('DD/MM/YYYY')})`,
				`Vous avez été en service pendant **${moment.utc(totalHours).format('HH[h]mm')}** cette semaine`, { fields });

			return embed;

		});

		embeds.sort((a, b) => {
			const aWeekNumber = parseInt(a.title!.split(' ')[2]);
			const bWeekNumber = parseInt(b.title!.split(' ')[2]);

			return aWeekNumber - bWeekNumber;
		});

		const pager = new Pager(interaction, embeds, embeds.length - 1);
		pager.run();

		await interaction.editReply({ content: `Modifiez vos heures sur l'[application web](http://lssd.tholeb.fr:8555/services/${interaction.targetUser.id} "Lien vers vos heures de services")`, embeds: [embeds[embeds.length - 1]], components: [...pager.makeButton()] });

		return;

	},
} satisfies ContextMenuUserCommand;