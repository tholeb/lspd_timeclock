import DiscordStrategy from 'passport-discord';
import Users from '@/models/Users';

type CustomProfile = DiscordStrategy.Profile & {
	refreshToken?: string | null | undefined;
}

const strategy = new DiscordStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: `http://localhost:${process.env.PORT}/auth/discord/callback`,
	scope: ['identify'],
}, async function (accessToken, refreshToken, profile: CustomProfile, done) {
	console.log(`${profile.username} Logged in (${profile.id})`);
	profile.refreshToken = refreshToken;
	Users.findOrCreate({
		where: { id: profile.id },
		defaults: {
			id: profile.id,
			username: profile.username,
			avatar: profile.avatar,
			email: profile.email,
		},
	}).then(([user]) => {
		done(null, user);
	});
});

export default strategy;