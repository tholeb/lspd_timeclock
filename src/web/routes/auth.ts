import Users from '@/models/Users';
import express from 'express';
import { RawUserData } from 'discord.js/typings/rawDataTypes';
import passport from 'passport';

const auth = express();

auth.get('/discord', passport.authenticate('discord'));
auth.get('/discord/callback',
	passport.authenticate('discord', { failureRedirect: '/auth/discord', successRedirect: '/' }),
	async (req, res) => {
		const user = req.user as RawUserData;

		const userInDB = await Users.findOne({ where: { id: user.id } });

		res.cookie('user_id', user.id, { maxAge: 900000 });
		res.cookie('serviceTaken', false, { maxAge: 900000 });

		if (userInDB?.rpname) {
			res.cookie('rpname', userInDB.rpname, { maxAge: 900000 });
		}
		else {
			res.cookie('rpname', 'none', { maxAge: 900000 });
		}
	},
);

export default auth;