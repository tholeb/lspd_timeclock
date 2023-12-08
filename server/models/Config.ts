import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';


export default (sequelize: Sequelize) => {
	class Config extends Model<InferAttributes<Config>, InferCreationAttributes<Config>> {
		declare guildId: string;
		declare key: string;
		declare value: string;
		declare modifierId: string;
	}

	Config.init({
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		key: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
		},
		modifierId: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
		},
	}, {
		sequelize: sequelize,
		tableName: 'config',
	});

	return Config;
};