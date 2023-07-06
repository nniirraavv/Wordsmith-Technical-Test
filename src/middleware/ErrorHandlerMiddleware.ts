import { Inject, ProvideAsSingleton } from "../context/IocProvider";
import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../types";
import { ErrorMap, Errors } from "../models/Errors";
import { BaseRoute } from "../routes/BaseRoute";
import { LoggerFactory } from "../context/components/LoggerFactory";

@ProvideAsSingleton(ErrorHandlerMiddleware)
export class ErrorHandlerMiddleware {
    private logger: Logger;

    constructor(@Inject(BaseRoute) private baseRoute: BaseRoute) {
        this.logger = LoggerFactory.getLogger('ErrorHandlerMiddleware');
    }

    sendError(err: any, request: Request, response: Response, next: NextFunction) {

        if (err['type'] === 'entity.parse.failed') {
            err.message = Errors.BAD_REQUEST;
        }

        let eo: ErrorType = ErrorMap[err.message];
        if (eo) {
            if (err['payloadData']) eo.payloadData = err['payloadData'];
            this.baseRoute.sendErrorResponse(response, eo);
        }
        else {
            if (err.stack) this.logger.debug(err.stack);
            this.baseRoute.sendErrorResponse(response, ErrorMap[Errors.GENERIC_ERROR]);
        }
        next();
    }
}
