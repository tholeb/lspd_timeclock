import { APIActionRowComponent, APIEmbed, APIMessageActionRowComponent, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js';

export default class Pager<I extends CommandInteraction> {
	private readonly interaction: I;
	private readonly pages: APIEmbed[];
	private index: number;

	constructor(interaction: I, pages: APIEmbed[]) {
		this.interaction = interaction;
		this.pages = pages;
		this.index = 0;
	}

	public run() {
		const collector = this.interaction.channel!.createMessageComponentCollector({ time: 3_600_000 });

		collector.on('collect', async i => {
			await i.deferUpdate();
			switch (i.customId) {
				case 'previous':
					this.index--;
					await this.interaction.editReply({ embeds: [this.pages[this.index]], components: [this.makeButton()] });
					break;
				case 'next':
					this.index++;
					await this.interaction.editReply({ embeds: [this.pages[this.index]], components: [this.makeButton()] });
					break;
			}
		});

		collector.on('end', collected => {
			this.interaction.editReply({ content: `Délai d'attente dépassé (Vous avez tourné ${collected.size} pages).`, components: [] });
		});
	}

	public makeButton(): APIActionRowComponent<APIMessageActionRowComponent> {
		const row = new ActionRowBuilder();

		const previous = new ButtonBuilder()
			.setCustomId('previous')
			.setLabel('<')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(this.index === 0);

		const next = new ButtonBuilder()
			.setCustomId('next')
			.setLabel('>')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(this.index === this.pages.length - 1);

		const pages = new ButtonBuilder()
			.setCustomId('pages')
			.setLabel(`${this.index + 1}/${this.pages.length}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true);

		row.addComponents(previous, next, pages);

		return row.toJSON() as APIActionRowComponent<APIMessageActionRowComponent>;
	}

}