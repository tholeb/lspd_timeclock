import Client from '@/Client';
import express from 'express';
import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import session from 'express-session';
import { RawUserData } from 'discord.js/typings/rawDataTypes';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import path from 'node:path';
import { getGitCommit } from '@/utils/GitCommit';
import api from './api';
import Users from '@/models/Users';

const scopes = ['identify'];

const app = express();
const port = 3000;

type user = RawUserData & {
	rpname?: string | null | undefined;
}

function ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (req.isAuthenticated()) {
		return next();
	}

	// User is not authenticated, redirect to the Discord login page
	res.redirect('/auth/discord');
}

function main(client: Client) {
	app.listen(port, () => {
		client.logger.webserver(`Webapp listening on port http://localhost:${port}`);
	});

	app.engine(
		'handlebars',
		engine({
			defaultLayout: 'main',
			helpers: {
				json: function (context: unknown) {
					return JSON.stringify(context);
				},
			},
		}),
	);
	app.set('view engine', 'handlebars');
	app.set('views', path.join(__dirname, 'views'));

	app.use('*', (req, res, next) => {
		client.logger.webserver(`${req.method} request made to ${req.url} from ${req.ip}`);
		next();
	});

	app.use(cookieParser());

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
	}, async function (accessToken, refreshToken, profile, done) {
		console.log(`${profile.username} Logged in (${profile.id})`);
		if (profile) {
			const [user, created] = await Users.findOrCreate({
				where: { id: profile.id },
				defaults: {
					id: profile.id,
					username: profile.username,
					avatar: profile.avatar,
					email: profile.email,
				},
			});

			console.log(user, created);
			return done(null, profile);
		}
		else {
			return done(null, false);
		}
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
		async (req, res) => {
			const user = req.user as RawUserData;

			const userInDB = await Users.findOne({ where: { id: user.id } });

			res.cookie('user_id', user.id, { maxAge: 900000 });

			if (userInDB?.rpname) {
				res.cookie('rpname', userInDB.rpname, { maxAge: 900000 });
			}
			else {
				res.cookie('rpname', 'none', { maxAge: 900000 });
			}

			// Successful authentication, redirect to the profile page
			res.redirect('/services/' + user.id);
		},
	);

	app.use('/api', api);
	app.get('/logout', function (req, res) {
		req.session.destroy(() => {
			Object.getOwnPropertyNames(req.cookies).forEach((name) => res.clearCookie(name));

			res.redirect('/');
		});
	});

	app.get('/info', ensureAuthenticated, function (req, res) {
		res.json(req.user);
	});

	app.get('/services/all', ensureAuthenticated, async (req, res) => {
		const user = req.user as user;
		const isAuthenticated = req.isAuthenticated();

		const rpname = await Users.findOne({ where: { id: user.id }, attributes: ['rpname'] });

		user.rpname = rpname?.getDataValue('rpname');

		return res.render('serviceAll', { user, isAuthenticated, getGitCommit });
	});

	app.get('/services/:id', ensureAuthenticated, async (req, res) => {
		const user = req.user as user;
		const isAuthenticated = req.isAuthenticated();

		const rpname = await Users.findOne({ where: { id: user.id }, attributes: ['rpname'] });

		user.rpname = rpname?.getDataValue('rpname');

		return res.render('service', { user, isAuthenticated, getGitCommit });
	});

	app.use('/', ensureAuthenticated, (req, res) => {
		res.send('Web app started !');
	});

}

export default main;