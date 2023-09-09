import { Collection, Client as DiscordClient, GatewayIntentBits, ChatInputApplicationCommandData, Interaction, ChatInputCommandInteraction, AutocompleteInteraction, UserApplicationCommandData, ModalSubmitInteraction, ClientEvents, UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction, MessageApplicationCommandData } from 'discord.js';

import logger from '@/utils/logger';

import sheets from '~/config.json';

export default class Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {

	public readonly commands: Collection<string, ChatInputCommand>;
	public readonly events: Collection<string, Event>;
	public readonly modals: Collection<string, Modal>;
	public readonly contextMenus: Collection<string, ContextMenuUserCommand | ContextMenuMessageCommand>;
	public readonly logger;
	public readonly config;

	constructor() {
		super({ intents: [GatewayIntentBits.Guilds] });

		this.commands = new Collection();
		this.events = new Collection();
		this.modals = new Collection();
		this.contextMenus = new Collection();

		this.logger = logger;

		this.config = sheets;
	}
}

export interface ChatInputCommand {
	enabled: boolean;
	data: ChatInputApplicationCommandData;
	execute: (client: Client<true>, interaction: ChatInputCommandInteraction) => unknown;
	autocomplete?: (client: Client<true>, interaction: AutocompleteInteraction) => Promise<void>;
}

export interface ContextMenuUserCommand {
	enabled: boolean;
	data: UserApplicationCommandData;
	execute: (client: Client<true>, interaction: UserContextMenuCommandInteraction) => Promise<void>;
}

export interface ContextMenuMessageCommand {
	enabled: boolean;
	data: MessageApplicationCommandData;
	execute: (client: Client<true>, interaction: MessageContextMenuCommandInteraction) => Promise<void>;
}

export interface Event {
	name: keyof ClientEvents;
	once: boolean;
	execute: (client: Client<true>, interaction: Interaction) => Promise<void>;
}


export interface Modal {
	name: string;
	execute: (client: Client<true>, interaction: ModalSubmitInteraction) => Promise<void>;
}