import * as express from "express";
import * as Joi from "joi";

import { Inject, ProvideAsSingleton } from "../../context/IocProvider";
import { LoggerFactory } from "../../context/components/LoggerFactory";
import {
    AccountAllowedSortingFields,
    HttpMethodsType, SortOrder,
} from "../../models/Enums";
import { BaseRoute } from "../BaseRoute";
import { AccountService } from "../../services/AccountService";
import { AccountBaseRequest } from "../../types";
import { values } from "lodash";

@ProvideAsSingleton(AccountRoutes)
export class AccountRoutes extends BaseRoute {
    private logger: Logger;
    private joi: any;

    constructor(
        @Inject(AccountService) private accountService: AccountService
    ) {
        super();
        this.logger = LoggerFactory.getLogger('AccountRoutes');
        this.joi = Joi.extend(require("joi-phone-number"));
        this._descriptor = {
            getAccounts: {
                handler: this.getAccounts.bind(this),
                method: HttpMethodsType.post,
                path: '/:version/accounts',
                parameters: {
                    body: {
                        page: this.joi.number().min(0).default(1),
						pageSize: this.joi.number().min(0).default(50),
                        search: this.joi.string().optional().allow(null),
                        sort: this.joi.array().items(this.joi.object({
							field: this.joi.string().allow(...values(AccountAllowedSortingFields)).required(),
							order: this.joi.string().allow(...values(SortOrder)).required()
						})).optional().allow(null)
                    }
                }
            },
            createAccount: {
                handler: this.createAccount.bind(this),
                method: HttpMethodsType.post,
                path: '/:version/account',
                parameters: {
                    body: {
						name: this.joi.string().required(),
						address: this.joi.string().optional(),
						email: this.joi.string().lowercase().email().required(),
						phoneNumber: this.joi.string().phoneNumber({format: 'international'}).optional().allow(null),
                        isActive: this.joi.boolean().optional()
                    }
                }
            },
            updateAccount: {
                handler: this.updateAccount.bind(this),
                method: HttpMethodsType.put,
                path: '/:version/account',
                parameters: {
                    body: {
                        id: this.joi.number().required(),
                        name: this.joi.string().required(),
						address: this.joi.string().optional(),
						email: this.joi.string().lowercase().email().required(),
						phoneNumber: this.joi.string().phoneNumber({format: 'international'}).optional().allow(null),
                        isActive: this.joi.boolean().optional()
                    }
                }
            },
            getAccount: {
                handler: this.getAccount.bind(this),
                method: HttpMethodsType.get,
                path: '/:version/account/:accountId',
                parameters: {
                    params: {
                        accountId: this.joi.number().required()
                    }
                }
            },
            removeAccount: {
                handler: this.removeAccount.bind(this),
                method: HttpMethodsType.delete,
                path: '/:version/account/:accountId',
                parameters: {
                    params: {
                        accountId: this.joi.number().required()
                    }
                }
            },
        };
    }

    public async getAccounts(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const { page, pageSize, search, sort } = request.body;
            const organizations = await this.accountService.getAccounts(page, pageSize, search, sort);
            this.sendPageResponse(response, page, pageSize, organizations.items, organizations.totalCount);
        } catch (err: any) {
            this.logger.error('Error getting device: ' + err.message ? err.message : err.stack);
            next(err);
        }
    }
    
    async createAccount(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const { body } = request;
            const createAccount: AccountBaseRequest = {
                name: body.name,
                address: body.address,
                email: body.email,
                phoneNumber: body.phoneNumber,
                isActive: body.isActive
            };
            const account = await this.accountService.createAccount(createAccount);
            this.sendEntityResponse(response, account);
        } catch (err: any) {
            this.logger.error('Error while creating account: ' + err.message ? err.message : err.stack);
            next(err);
        }
    }

    async updateAccount(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const { body } = request;
            const accountId = +body.id;
            const updateAccount: AccountBaseRequest = {
                name: body.name,
                address: body.address,
                email: body.email,
                phoneNumber: body.phoneNumber,
                isActive: body.isActive
            };
            const account = await this.accountService.updateAccount(accountId, updateAccount);
            this.sendEntityResponse(response, account);
        } catch (err: any) {
            this.logger.error('Error while updating account: ' + err.message ? err.message : err.stack);
            next(err);
        }
    }

    async getAccount(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const { params } = request;
            const account = await this.accountService.getAccount(+params.accountId);
            this.sendEntityResponse(response, account);
        } catch (err: any) {
            this.logger.error('Error while fetching account: ' + err.message ? err.message : err.stack);
            next(err);
        }
    }

    async removeAccount(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const { params } = request;
            const account = await this.accountService.removeAccount(+params.accountId);
            this.sendEntityResponse(response, account);
        } catch (err: any) {
            this.logger.error('Error while removing account: ' + err.message ? err.message : err.stack);
            next(err);
        }
    }

}
