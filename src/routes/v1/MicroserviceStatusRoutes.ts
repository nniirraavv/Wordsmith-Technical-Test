import * as express from "express";
import { ProvideAsSingleton } from "../../context/IocProvider";
import { BaseRoute } from "../BaseRoute";
import { LoggerFactory } from "../../context/components/LoggerFactory";
import { HttpMethodsType } from "../../models/Enums";
import { join, resolve } from "path";
import * as fs from "fs";

@ProvideAsSingleton(MicroserviceStatusRoutes)
export class MicroserviceStatusRoutes extends BaseRoute {
    private logger: Logger;

    constructor() {
        super();
        this.logger = LoggerFactory.getLogger('MicroserviceStatusRoutes')
        this._descriptor = {
            healtz: {
                handler: this.healtz.bind(this),
                method: HttpMethodsType.get,
                path: '/healthz'
            }
        }
    }

    public async healtz(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {

            /**
             * Postgres Validation
             */
            let postgresRepoFolder: string = resolve(__dirname, "../../models/postgres/po");
            let postgresModels = fs.readdirSync(postgresRepoFolder);
            if (postgresModels.length) {
                postgresModels = postgresModels.filter(file => /\.js$/gi.test(file));

                for (let file of postgresModels) {
                    let prototypeName = file.replace('.js', '');
                    let model = (require(join(postgresRepoFolder, file))[prototypeName]);
                    await model.findOne();
                    // if the model definition is different of the database ith throws an error and the health check fails
                }
            }

            // this.logger.info('[BOOTING] Data models initialization has been completed');
            this.sendVoidSuccessResponse(response);
            next();
        }
        catch (err: any) {
            this.logger.error('Error checking health status of the microservice: ' + err.message ? err.message : err.stack);
            next(err);
        }
    }
}