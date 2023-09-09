import Client from '@/Client';
import Shift from '@/models/Shifts';
import express from 'express';
import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import session from 'express-session';
import { RawUserData } from 'discord.js/typings/rawDataTypes';
import crypto from 'crypto';

const scopes = ['identify'];

const app = express();
const port = 3000;

function main(client: Client) {
	app.listen(port, () => {
		client.logger.webserver(`Webapp listening on port ${port}`);
	});

	app.use('*', (req, res, next) => {
		client.logger.webserver(`${req.method} request made to ${req.url} from ${req.ip}`);
		next();
	});

	app.use(session({
		secret: crypto.randomUUID(),
		resave: false,
		saveUninitialized: false,
	}));

	app.use(passport.initialize());

	app.use(passport.session());

	passport.use(new DiscordStrategy({
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: `http://localhost:${port}/auth/discord/callback`,
		scope: scopes,
	}, function (accessToken, refreshToken, profile, done) {
		console.log('profile', profile);
		if (profile) {
			return done(null, profile);
		}
		else {
			return done(null, false);
		}
		/* User.findOrCreate({ discordId: profile.id }, function (err, user) {
			return cb(err, user);
		}); */
	}));

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj: Express.User, done) {
		done(null, obj);
	});

	app.get('/auth/discord', passport.authenticate('discord'));
	app.get('/auth/discord/callback',
		passport.authenticate('discord', { failureRedirect: '/auth/discord' }),
		(req, res) => {
			const user = req.user as RawUserData;

			// Successful authentication, redirect to the profile page
			res.redirect('/services/' + user.id);
		},
	);

	app.get('/logout', function (req, res) {
		req.session.destroy(() => {
			Object.getOwnPropertyNames(req.cookies).forEach((name) => res.clearCookie(name));

			res.redirect('/');
		});
	});

	app.get('/info', ensureAuthenticated, function (req, res) {
		res.json(req.user);
	});

	app.get('/api/services/:id', async function (req, res) {
		try {
			const services = await Shift.findAll({ where: { userId: req.params.id } });

			res.json(services);
		}
		catch (error) {
			res.status(500).json({ error });
		}
	});

	function ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
		if (req.isAuthenticated()) {
			return next();
		}

		// User is not authenticated, redirect to the Discord login page
		res.redirect('/auth/discord');
	}

	app.get('/services/:id', ensureAuthenticated, async (req, response) => {
		return response.sendFile('index.html', { root: './src/web/public' });
	});

	app.use('/', ensureAuthenticated, (req, res) => {
		res.send('started !');
	});

}

export default main;