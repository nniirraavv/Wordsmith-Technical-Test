import * as express from "express";
import { Dictionary } from "lodash";
import winston from "winston";
import { SchemaMap } from "@hapi/joi";
import { HttpMethodsType } from "../models/Enums";

declare global {
    type Logger = winston.Logger;
}

declare type ErrorType = {
    key?: string,
    status: number,
    code?: string,
    label?: string,
    headers?: any,
    payloadData?: any;
};

declare type ErrorMapType = {
    [key: string]: ErrorType;
};

export interface IConfigFile {
    logging: {
        level: string,
        useFileAppender: boolean,
        prefix: string,
        logsFolder: string;
        fileName: string,
        maxFiles: number,
        maxSize: number;
    };
    nodeEnv: string;
    port: string;
    db: {
        db_dialect: any;
        db_name: string;
        db_user: string;
        db_password: string;
        db_options?: {
            host?: string;
            port: number;
            readHost?: string;
            writeHost?: string;
        };
    };
}

declare type ApiDescriptor = {
    handler: Function,
    method: HttpMethodsType,
    path: string,
    parameters?: SchemaMap;
};

declare type RoutesDescriptor = Dictionary<ApiDescriptor>;

declare type PagedResult<T> = {
    items: Array<T>,
    totalCount: number;
};

declare type SortCondition<T> = {
    field: T,
    order: SortOrder
};

declare type AccountBaseRequest = {
    name: string;
    email: string;
    address?: string;
    phoneNumber?: string;
    isActive?: boolean;
}