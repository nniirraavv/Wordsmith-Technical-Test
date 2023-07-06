import { Inject, Provide } from "../../context/IocProvider";
import { BootPhase } from "../BootPhase";
import { Application } from "../../context/Application";
import { LoggerFactory } from "../../context/components/LoggerFactory";
import { PostgresDB } from "../../context/components/PostgresDB";
import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";
import { resolve } from "path";

@Provide(PostgresDBMigrationPhase)
export class PostgresDBMigrationPhase extends BootPhase {

    protected logger: Logger = LoggerFactory.getLogger("PostgresDBMigrationPhase");
    private umzug: Umzug<any>;

    constructor(@Inject(PostgresDB) private pgDB: PostgresDB) {
        super();
        const sequelizeInstance: Sequelize = this.pgDB.getInstance();

        this.umzug = new Umzug({

            // The options for the storage.
            storage: new SequelizeStorage({
                sequelize: sequelizeInstance
            }),

            // The logging function.
            // A function that gets executed everytime migrations start and have ended.
            logger: undefined,

            // An optional context object, which will be passed to each migration function
            // context: sequelizeInstance.getQueryInterface(),

            // The migrations that the Umzug instance should perform
            migrations: {
                glob: resolve(__dirname, '../../migrations/*.js'),
                resolve: ({ name, path, context }: any) => {
                    const migration = require(path)
                    return {
                        // adjust the parameters Umzug will
                        // pass to migration methods when called
                        name,
                        up: async () => migration.up(sequelizeInstance.getQueryInterface()),
                        down: async () => migration.down(sequelizeInstance.getQueryInterface()),
                    }
                }
            }
        } as any);

        this.umzug.on('migrating', (ev) =>
            this.logger.debug(`PostgresDB database migration '${ev.name}' is about to be executed.`)
        );

        this.umzug.on('migrated', (ev) =>
            this.logger.debug(`PostgresDB database migration '${ev.name}' has successfully been executed.`)
        );

        this.umzug.on('reverting', (ev) =>
            this.logger.debug(`PostgresDB database migration '${ev.name}' is about to be reverted.`)
        );

        this.umzug.on('reverted', (ev) =>
            this.logger.debug(`PostgresDB database migration '${ev.name}' has successfully been reverted.`)
        );
    }

    async execute(app: Application): Promise<void> {
        this.logger.info('[BOOTING] Starting PostgresDB database migrations...');

        const pendingMigrationsResults = await this.umzug.pending();
        if (pendingMigrationsResults && pendingMigrationsResults.length > 0) {
            const migrationsToExecute = pendingMigrationsResults.map(migration => migration.name);
            await this.umzug.up({ migrations: migrationsToExecute });
            this.logger.debug("[BOOTING] Migration results:\n" + JSON.stringify(pendingMigrationsResults.map(migration => migration.name)));
        }

        this.logger.info('[BOOTING] PostgresDB Database migrations finished!');
    }

}