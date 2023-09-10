import Shift from '@/models/Shifts';
import Users from '@/models/Users';
import express from 'express';

const api = express();

api.use(express.json());

api.get('/services/', async function (req, res) {
	try {
		const services = await Shift.findAll();

		res.json(services);
	}
	catch (error) {
		res.status(500).json({ error });
	}
});

api.get('/services/:id', async function (req, res) {
	try {
		const services = await Shift.findAll({ where: { userId: req.params.id } });

		res.json(services);
	}
	catch (error) {
		res.status(500).json({ error });
	}
});

api.put('/services/:id', async (req, res) => {
	console.log(req.body);
	const { id, type, ...rest } = req.body;

	try {
		const update = Shift.update({ [type]: rest[type] }, { where: { id } });

		res.json(update);
	}
	catch (error) {
		res.status(500).json({ error });
	}
});

api.put('/user/:id', async (req, res) => {
	console.log(req.body);
	const id = req.params.id;
	const { matricule, identity } = req.body;

	try {
		const update = Users.update({ rpname: `${matricule} | ${identity}` }, { where: { id } });

		res.cookie('rpname', `${matricule} | ${identity}`, { maxAge: 900000 });

		res.json(update);
	}
	catch (error) {
		res.status(500).json({ error });
	}
});

export default api;