// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	plugins: [
		'~/plugins/sequelize.server.ts',
	],
	modules: [
		'@sidebase/nuxt-auth',
		'@element-plus/nuxt',
		'@nuxtjs/eslint-module',
		'@formkit/auto-animate/nuxt',
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
	elementPlus: {
		themes: ['dark'],
	},
	eslint: {
		fix: true,
	},
});
