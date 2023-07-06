import { Provide } from "../context/IocProvider";
import { ErrorType, RoutesDescriptor } from "../types";
import * as express from "express";
import { ResponseStatus } from "../models/Enums";


@Provide(BaseRoute)
export abstract class BaseRoute {
    protected _descriptor: RoutesDescriptor = {};
    protected apiVersion: string = "";

    public get descriptor(): RoutesDescriptor {
        let d = Object.assign({}, this._descriptor);
        Object.keys(d).forEach((k: string) => {
            d[k].path = d[k].path.replace(":version", this.apiVersion);
            return k;
        });
        return d;
    }

    public setApiVersion(v: string): void {
        this.apiVersion = v;
    }

    sendVoidSuccessResponse(response: express.Response) {
        response.status(200).send({
            status: ResponseStatus.ok
        });
        response.end();
    }

    sendEntityResponse(response: express.Response, responseObject: any) {
        response.status(200).send({
            status: ResponseStatus.ok,
            item: responseObject
        });
        response.end();
    }

    sendArrayResponse(response: express.Response, responseObject: any) {
        response.status(200).send({
            status: ResponseStatus.ok,
            items: responseObject
        });
        response.end();
    }

    sendPageResponse(response: express.Response, index: number, size: number, items: Array<any>, total: number) {
        response.status(200).send({
            status: ResponseStatus.ok,
            total: total,
            page: {
                index: index,
                size: size == 0 ? total : size,
                items: items
            }
        });
        response.end();
    }

    sendErrorResponse(response: express.Response, error: ErrorType) {
        let errorResponse: any = {
            status: ResponseStatus.error,
            error: {
                code: error.code,
                message: error.label
            }
        };
        if (!!error.headers) response.set(error.headers);
        if (!!error.payloadData) errorResponse.error['payload'] = error.payloadData;
        response.status(error.status).send(errorResponse);
        response.end();
    }
}
