import { ErrorMapType } from "../types";

export enum Errors {
    FORBIDDEN = "FORBIDDEN",
    BAD_REQUEST = "BAD_REQUEST",
    ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
    GENERIC_ERROR = "GENERIC_ERROR",
    JOI_VALIDATION_FAILED = "JOI_VALIDATION_FAILED",
    POSTGRES_CONFIGURATION_MISSING = "POSTGRES_CONFIGURATION_MISSING",
    UNAUTHORIZED = "UNAUTHORIZED"
}

export const ErrorMap: ErrorMapType = {
    FORBIDDEN: {
        label: "Forbidden",
        code: "forbidden",
        status: 403
    },
    BAD_REQUEST: {
        label: "Bad request",
        code: "bad-request",
        status: 400
    },
    ENTITY_NOT_FOUND: {
        label: "Entity not found",
        code: "entity-not-found",
        status: 404
    },
    GENERIC_ERROR: {
        label: "Internal server error",
        code: "generic-service-error",
        status: 500
    },
    JOI_VALIDATION_FAILED: {
        label: "Joi validation failed",
        code: "joi-validation-failed",
        status: 400
    }
};
