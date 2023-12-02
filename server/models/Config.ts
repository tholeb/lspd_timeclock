import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';


export default (sequelize: Sequelize, types: typeof DataTypes = DataTypes) => {
	class Config extends Model<InferAttributes<Config>, InferCreationAttributes<Config>> {
		declare guildId: string;
		declare key: string;
		declare value: string;
		declare modifierId: string;
	}

	Config.init({
		guildId: {
			type: types.STRING,
			allowNull: false,
			primaryKey: true,
		},
		key: {
			type: types.STRING,
			allowNull: false,
			primaryKey: true,
		},
		value: {
			type: types.STRING,
			allowNull: false,
			unique: false,
		},
		modifierId: {
			type: types.STRING,
			allowNull: false,
			unique: false,
		},
	}, {
		sequelize: sequelize,
		tableName: 'config',
	});

	return Config;
};