import { DataTypes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Accounts", timestamps: true })
export class AccountModel extends Model<AccountModel> {
	@Column({
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		autoIncrementIdentity: true
	})
	public id!: number;

	@Column({
		type: DataTypes.STRING(255),
		allowNull: true
	})
	public name!: string;

	@Column({
		type: DataTypes.STRING(128),
		allowNull: false
	})
	public set email(val: string) {
		this.setDataValue('email', val.toLowerCase());
	}

	@Column({
		type: DataTypes.STRING(255),
		allowNull: true
	})
	public address?: string;

	@Column({
		type: new DataTypes.STRING(32),
		allowNull: true,
	})
	public phoneNumber?: string;

	@Column({
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	})
	public isActive!: boolean;

}
