import { Dialect, Sequelize } from 'sequelize';

const database = new Sequelize({
	dialect: 'sqlite' as Dialect,
	storage: './db.sqlite3',
});

export default database;