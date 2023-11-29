import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
	// TODO: SET A STRONG SECRET, SEE https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler#secret
	secret: process.env.AUTH_SECRET || 'my-auth-secret',
	// TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
	providers: [
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		DiscordProvider.default({
			clientId: process.env.CLIENT_ID || 'enter-your-client-id-here',
			clientSecret: process.env.CLIENT_SECRET || 'enter-your-client-secret-here',
			authorization: { params: { scope: 'identify guilds' } },
		}),
	],
})