import { ProvideAsSingleton } from "../context/IocProvider";
import { RouteMiddleware } from "./RouteMiddleware";
import { LoggerFactory } from "../context/components/LoggerFactory";
import { ApiDescriptor } from "../types";
import { NextFunction, Request, Response } from "express";
import { Errors } from "../models/Errors";
import * as Joi from "joi";

@ProvideAsSingleton(ValidationMiddleware)
export class ValidationMiddleware implements RouteMiddleware {
    private logger: Logger;
    private joi: any;

    constructor() {
        this.logger = LoggerFactory.getLogger('ValidationMiddleware');
        this.joi = Joi.extend(require("joi-phone-number"));
    }

    async execute(idApi: string, apiDescriptor: ApiDescriptor, request: Request, response: Response, next: NextFunction) {
        if (!apiDescriptor.parameters)
            return next();

        this.logger.debug(`Validating request to path: ${request.path}`);

        if (!!apiDescriptor.parameters) {
            try {
                if (apiDescriptor.parameters.params) {
                    const joiSchemaValidation = await this.isJoiSchemaValid(request.params, apiDescriptor.parameters.params);
                    if (joiSchemaValidation) {
                        request.params = joiSchemaValidation;
                    }
                }
                if (apiDescriptor.parameters.body) {
                    const joiSchemaValidation = await this.isJoiSchemaValid(request.body, apiDescriptor.parameters.body);
                    if (joiSchemaValidation) {
                        request.body = joiSchemaValidation;
                    }
                }
                if (apiDescriptor.parameters.query) {
                    const joiSchemaValidation = await this.isJoiSchemaValid(request.query, apiDescriptor.parameters.query);
                    if (joiSchemaValidation) {
                        request.query = joiSchemaValidation;
                    }
                }
            } catch (error) {
                next(error)
            }
        }

        return next();
    }

    private async isJoiSchemaValid(requestParam: any, parameters: any): Promise<any> {
        let apiDescriptorJoiSchema = this.joi.object().keys(parameters).unknown(false);
        try {
            let { value, error } = apiDescriptorJoiSchema.validate(requestParam);
            if (!!error) {
                throw error; // sent error to the catch
            }
            return value;
        } catch (error: any) {
            this.logger.error("Error validating parameters: " + error.message);
            let newError: any = new Error(Errors.JOI_VALIDATION_FAILED);
            newError['payloadData'] = error.details ? error.details : [];
            throw newError;
        }
    }
}
