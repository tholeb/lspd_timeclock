import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	plugins: [
		'~/plugins/sequelize.server.ts',
	],
	modules: [
		(_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', (config) => {
				// @ts-expect-error
				config.plugins.push(vuetify({ autoImport: true }));
			});
		},
		'@sidebase/nuxt-auth',
		'@nuxtjs/eslint-module',
		'@invictus.codes/nuxt-vuetify',
	],
	auth: {
		isEnabled: true,
		baseURL: process.env.AUTH_ORIGIN,
		provider: {
			type: 'authjs',
		},
		globalAppMiddleware: {
			isEnabled: true,
		},
	},
	runtimeConfig: {
		database: {
			dialect: process.env.DB_DIALECT || 'sqlite',
			storage: process.env.DB_STORAGE || './db.sqlite3',
		},
	},
	eslint: {
		fix: true,
	},
	build: {
		transpile: ['vuetify'],
	},
	vite: {
		vue: {
			template: {
				transformAssetUrls,
			},
		},
	},
	vuetify: {
		/* vuetify options */
		vuetifyOptions: {
			// @TODO: list all vuetify options
		},

		moduleOptions: {
			/* nuxt-vuetify module options */
			treeshaking: true,
			useIconCDN: true,

			/* vite-plugin-vuetify options */
			styles: true,
			autoImport: true,
			useVuetifyLabs: false,
		},
	},
});
