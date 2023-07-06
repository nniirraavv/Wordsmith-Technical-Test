import { Op, WhereOptions } from "sequelize";
import { ProvideAsSingleton } from "../../context/IocProvider";
import { BaseRepository } from "./BaseRepository";
import { AccountModel } from "./po/AccountModel";
import { AccountBaseRequest, PagedResult, SortCondition } from "../../types";
import { AccountAllowedSortingFields, SortOrder } from "../Enums";

@ProvideAsSingleton(AccountRepository)
export class AccountRepository extends BaseRepository<AccountModel>{

	constructor() {
		super();
		this.registerModel(AccountModel);
	}

	createAccount(account: AccountBaseRequest): Promise<AccountModel> {
		return this.model.create({
			name: account.name,
			address: account.address,
			email: account.email,
			phoneNumber: account.phoneNumber,
			isActive: account.isActive
		});
	}

	async updateAccount(account: AccountModel, accountObj: object): Promise<AccountModel> {
		await account.update(accountObj);
		return account.reload();
	}

	public getPageWithFilter(page: number = 0, pageSize: number = 0, search?: string, sort?: SortCondition<AccountAllowedSortingFields>[]): Promise<PagedResult<AccountModel>> {
		let query: WhereOptions = {};

		if (search) {
			const searchRaw = search.replace(/(_|%|\\)/g, '\\$1');
			const inputSec = this.model.sequelize.escape(`%${searchRaw}%`);
			const searchLike = this.model.sequelize.literal(`${inputSec} ESCAPE '\\'`);
			query = {
				...query,
				[Op.or]: [
					{ name: { [Op.iLike]: searchLike } },
					{ email: { [Op.iLike]: searchLike } },
					{ address: { [Op.iLike]: searchLike } },
					{ phoneNumber: { [Op.iLike]: searchLike } },
				]
			}
		}
		let sortBy: Array<any>  = [[AccountAllowedSortingFields.createdAt, SortOrder.ASC]];
		if (sort) {
            sortBy = sort.map((cond: SortCondition<AccountAllowedSortingFields>) => {
                return [cond.field, cond.order];
            });
        }

		return super.findPage(query, sortBy, page, pageSize);
	}
}
