// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
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
	elementPlus: {
		themes: ['dark'],
	},
	eslint: {
		fix: true,
	},
});
