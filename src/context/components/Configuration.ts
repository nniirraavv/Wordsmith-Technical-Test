/**
 * Dotenv is a zero-dependency module that loads environment variables
 * from a .env file into process.env
 */
import * as dotenv from "dotenv";
import { IConfigFile } from "../../types";

dotenv.config();
const { env } = process;

export const CONFIG: IConfigFile = {
    logging: {
        level: env.LOG_LEVEL as string,
        logsFolder: env.LOG_PATH as string,
        useFileAppender: false,
        prefix: "Simple",
        fileName: "account-management-logs.log",
        maxFiles: 5,
        maxSize: 10485760
    },
    nodeEnv: env.NODE_ENV || "development",
    port: env.HTTP_PORT || "3000",
    db: {
        db_dialect: env.DB_DIALECT,
        db_name: env.DB_NAME as string,
        db_user: env.DB_USER as string,
        db_password: env.DB_PASSWORD as string,
        db_options: {
            host: env.DB_HOST as string || undefined,
            port: parseInt(env.DB_PORT as string, 10),
            readHost: env.DB_HOST_READ as string || undefined,
            writeHost: env.DB_HOST_WRITE as string || undefined
        },
    }
};
