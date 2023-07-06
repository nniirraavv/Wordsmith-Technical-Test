import { Inject, ProvideAsSingleton } from "../context/IocProvider";
import { LoggerFactory } from "../context/components/LoggerFactory";
import { AccountAllowedSortingFields } from "../models/Enums";
import { Errors } from "../models/Errors";

import { AccountRepository } from "../models/postgres/AccountRepository";
import { AccountModel } from "../models/postgres/po/AccountModel";
import { AccountBaseRequest, PagedResult, SortCondition } from "../types";

@ProvideAsSingleton(AccountService)
export class AccountService {

	private logger: Logger = LoggerFactory.getLogger("AccountService");

	constructor(
		@Inject(AccountRepository) private accountRepository: AccountRepository
	) { }

	public async getAccounts(page: number = 1, pageSize: number = 50, search?: string, sort?: SortCondition<AccountAllowedSortingFields>[]): Promise<PagedResult<AccountModel>>{
		return this.accountRepository.getPageWithFilter(page, pageSize, search, sort);
	}

	async createAccount(account: AccountBaseRequest): Promise<AccountModel> {
		this.logger.info("Creating new account");
		return this.accountRepository.createAccount(account)
	}

	async updateAccount(accountId: number, accountUpdateObj: AccountBaseRequest): Promise<AccountModel> {
		this.logger.info(`Updating account for ID: ${accountId}`);
		const account = await this.accountRepository.getById(accountId);
		if (!account) throw new Error(Errors.ENTITY_NOT_FOUND);

		return this.accountRepository.updateAccount(account, accountUpdateObj);
	}

	async getAccount(accountId: number): Promise<AccountModel> {
		this.logger.info(`Fetching account for ID: ${accountId}`);
		const account = await this.accountRepository.getById(accountId);
		if (!account) throw new Error(Errors.ENTITY_NOT_FOUND);
		return account;
	}

	async removeAccount(accountId: number): Promise<AccountModel> {
		this.logger.info(`Removing account for ID: ${accountId}`);
		const account = await this.accountRepository.getById(accountId);
		if (!account) throw new Error(Errors.ENTITY_NOT_FOUND);
		await this.accountRepository.remove(account.id);
		return account;
	}

}
