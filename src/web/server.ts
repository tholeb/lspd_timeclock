import Client from '@/Client';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { RawUserData } from 'discord.js/typings/rawDataTypes';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import path from 'node:path';
import { getGitCommit } from '@/utils/GitCommit';
import api from './routes/api';
import strategy from './strategy';
import auth from './routes/auth';
import Users from '@/models/Users';
import moment from 'moment';
import refresh from 'passport-oauth2-refresh';
import Shifts from '@/models/Shifts';

const app = express();

type user = RawUserData & {
	rpname?: string | null | undefined;
}

function ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
	// User is not authenticated, redirect to the Discord login page
	if (!req.isAuthenticated()) {
		return res.redirect('/auth/discord');
	}

	return next();
}

function main(client: Client) {
	app.listen(process.env.PORT || 3000, () => {
		client.logger.webserver(`Webapp listening on port http://localhost:${process.env.PORT}`);
	});

	app.engine(
		'handlebars',
		engine({
			defaultLayout: 'main',
			layoutsDir: path.join(__dirname, 'views/layouts'),
			partialsDir: path.join(__dirname, 'views/partials'),
			helpers: {
				json: function (context: unknown) {
					return JSON.stringify(context);
				},
			},
		}),
	);
	app.set('view engine', 'handlebars');
	app.set('views', path.join(__dirname, 'views'));

	app.use(cookieParser());

	app.use(session({
		secret: process.env.SESSION_SECRET || crypto.randomBytes(20).toString('hex'),
		resave: false,
		saveUninitialized: false,
	}));

	app.use(passport.initialize());

	app.use(passport.session());

	passport.use(strategy);
	refresh.use(strategy);

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser((obj: RawUserData, done) => {
		done(null, obj);
	});

	app.use('*', (req, res, next) => {
		client.logger.webserver(`${req.method} request made to ${req.url} from ${req.ip}`);
		next();
	});

	app.use('/api', api);
	app.use('/auth', auth);
	app.get('/logout', function (req, res) {
		req.session.destroy(() => {
			Object.getOwnPropertyNames(req.cookies).forEach((name) => res.clearCookie(name));

			res.redirect('/');
		});
	});

	app.get('/supervision', ensureAuthenticated, async (req, res) => {
		const user = req.user as user;
		const isAuthenticated = req.isAuthenticated();

		const rpname = await Users.findOne({ where: { id: user.id }, attributes: ['rpname'] });

		user.rpname = rpname?.getDataValue('rpname');

		return res.render('serviceAll', { user, isAuthenticated, getGitCommit });
	});

	app.get('/services/:id?', ensureAuthenticated, async (req, res) => {
		const user = req.user as user;
		const isAuthenticated = req.isAuthenticated();
		const selectedWeek = parseInt(req.query.week as string) || moment().week();

		const rpname = await Users.findOne({ where: { id: user.id }, attributes: ['rpname'] });

		user.rpname = rpname?.getDataValue('rpname');

		const userId = req.params.id || user.id;

		/* const services = {
			48: [
				{ userid: '123456789', name: 'Test Service', status: 'online' },
				{ userid: '13161515', name: 'Test Servicddqse', status: 'onliqsdne' },
			],
			49: [
				{ userid: 'aaa', name: 'Test Service', status: 'online' },
				{ userid: 'sdq', name: 'Test Servicddqse', status: 'onliqsdne' },
			],
		}; */

		const services = await Shifts.findAll({ where: { userId, weekNumber: selectedWeek } });
		const weeks = await Shifts.findAll({ where: { userId }, attributes: ['weekNumber'] });

		return res.render('service', { user, isAuthenticated, getGitCommit, services: services[selectedWeek as keyof typeof services], weeks });
	});

	app.use('/', ensureAuthenticated, (req, res) => {
		const user = req.user as user;
		const isAuthenticated = req.isAuthenticated();

		return res.render('index', { user, isAuthenticated, getGitCommit });
	});

}

export default main;