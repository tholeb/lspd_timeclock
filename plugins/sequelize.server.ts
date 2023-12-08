import { Sequelize, type Dialect } from 'sequelize';
import fs from 'node:fs';
import path from 'node:path';

import database from '../server/database';


export default defineNuxtPlugin(async (nuxtApp) => {
	const models: { [key: string]: any } = {};
	const modelsDir = path.join(__dirname, '..', 'server', 'models');

	fs.readdirSync(modelsDir)
		.filter(file => file.endsWith('.ts'))
		.forEach(async file => {
			const modelPath = path.join(modelsDir, file);
			// eslint-disable-next-line no-inline-comments
			const model = await import(/* @vite-ignore */modelPath).then(m => m.default);

			const modelObj = model(database);

			models[modelObj.name] = modelObj;
		});

	Object.keys(models).forEach(modelName => {
		if (models[modelName].associate) {
			models[modelName].associate(models);
		}
	});

	try {
		await database.authenticate();
		await database.sync({ force: true });

		// this log was executed every time I navigate to a new route
		// or refreshing the browser.
		console.log('Connection has been established successfully.');
	}
	catch (error) {
		console.error('Unable to connect to the database:', error);
	}

	return {
		provide: {
			db: database,
		},
	};
});