import { Sequelize, DataTypes, type Dialect } from 'sequelize';
import fs from 'node:fs';
import path from 'node:path';
import Config from '~/server/models/Config';

export default defineNuxtPlugin(async (nuxtApp) => {
	const config = useRuntimeConfig();

	const models: { [key: string]: any } = {};
	const modelsDir = path.join(__dirname, '..', 'server', 'models');

	/* const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
		host: config.dbHost,
		port: parseInt(config.dbPort),
		dialect: 'mysql',
	}); */

	const sequelize = new Sequelize({
		dialect: config.database.dialect as Dialect,
		storage: config.database.storage,
	});

	fs.readdirSync(modelsDir)
		.filter(file => file.endsWith('.ts'))
		.forEach(async file => {
			const modelPath = path.join(modelsDir, file);
			// eslint-disable-next-line no-inline-comments
			const model = await import(/* @vite-ignore */modelPath).then(m => m.default);

			const modelObj = model(sequelize);

			models[modelObj.name] = modelObj;
		});

	Object.keys(models).forEach(modelName => {
		if (models[modelName].associate) {
			models[modelName].associate(models);
		}
	});

	try {
		await sequelize.authenticate();
		await sequelize.sync({ force: true });

		// this log was executed every time I navigate to a new route
		// or refreshing the browser.
		console.log('Connection has been established successfully.');
	}
	catch (error) {
		console.error('Unable to connect to the database:', error);
	}

	return {
		provide: {
			db: sequelize,
		},
	};
});