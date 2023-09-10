import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '@/common';

class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
	declare id: string;
	declare username: string;
	declare avatar: string | null;
	declare email: string | null;
	declare rpname?: string | null;
}

Users.init({
	id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	avatar: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	rpname: {
		type: DataTypes.STRING,
		allowNull: true,
	},
}, {
	sequelize,
	tableName: 'users',
});

export default Users;