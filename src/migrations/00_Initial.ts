import { DataTypes, QueryInterface, Sequelize } from "sequelize";

module.exports = {
	up: function (queryInterface: QueryInterface) {
		return queryInterface.createTable('Accounts', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				autoIncrementIdentity: true
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false
			},
			address: {
				type: DataTypes.STRING(255),
				defaultValue: null
			},
			phoneNumber: {
				type: DataTypes.STRING(32),
				allowNull: true
			},
			email: {
				type: DataTypes.STRING(128),
				allowNull: false
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()')
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: null
			}
		});
	},

	down: function (queryInterface: QueryInterface) {
		return queryInterface.dropTable('Accounts')
	}
};
