import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '@/common';

class Shift extends Model<InferAttributes<Shift>, InferCreationAttributes<Shift>> {
	declare id: CreationOptional<number>;
	declare userId: string;
	declare weekNumber: string;
	declare start: string;
	declare end: string | null;
}

Shift.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	userId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	weekNumber: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	start: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	end: {
		type: DataTypes.DATE,
		allowNull: true,
	},
}, {
	sequelize,
	tableName: 'shifts',
});

export default Shift;