import * as express from "express";
import { ApiDescriptor } from "../types";

export interface RouteMiddleware {
    execute(idApi: string, apiDescriptor: ApiDescriptor, req: express.Request, rest: express.Response, next: express.NextFunction): any;
}