import { ProvideAsSingleton } from "../context/IocProvider";
import { RouteMiddleware } from "./RouteMiddleware";
import { LoggerFactory } from "../context/components/LoggerFactory";
import { ApiDescriptor } from "../types";
import { NextFunction, Request, Response } from "express";

@ProvideAsSingleton(HandleRequestMiddleware)
export class HandleRequestMiddleware implements RouteMiddleware {
    private logger: Logger;

    constructor() {
        this.logger = LoggerFactory.getLogger('HandleRequestMiddleware');
    }

    execute(idApi: string, apiDescriptor: ApiDescriptor, request: Request, response: Response, next: NextFunction): any {
        if (request.path.indexOf('healthz') === -1) {
            this.logger.info(`Handling request. Api: ${idApi}, Method: ${apiDescriptor.method}, Path: ${request.path}`);
        }

        try {
            apiDescriptor.handler(request, response, next);
        } catch (err: any) {
            this.logger.error(err.message);
            next(err);
        }
    }

}