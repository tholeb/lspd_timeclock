import { APIEmbed } from 'discord.js';

export enum COLORS {
	DEFAULT = 0xD2B48C,
	ERROR = 0xff0000,
}

const basicEmbed = {
	timestamp: new Date().toISOString(),
	footer: {
		text: `${new Date().getFullYear()}`,
	},
};

export function createEmbed(title: string, description: string, color: number = COLORS.DEFAULT, options?: APIEmbed): APIEmbed {
	return {
		...basicEmbed,
		color,
		title,
		description,
		...options,
	};
}