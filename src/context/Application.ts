import * as express from "express";
import { container, ProvideAsSingleton } from "./IocProvider";
import { LoggerFactory } from "./components/LoggerFactory";
import { BootPhase } from "../boot/BootPhase";
import { PostgresDBPhase } from "../boot/phases/PostgresDBPhase";
import { ServerPhase } from "../boot/phases/ServerPhase";
import { PostgresDBMigrationPhase } from "../boot/phases/PostgresDBMigrationPhase";

@ProvideAsSingleton(Application)
export class Application {

	express!: express.Application;
	private logger: Logger;

	constructor() {
		this.logger = LoggerFactory.getLogger("Application")
	}

	async bootstrap(): Promise<void> {
		this.express = express();
		this.logger.info('[BOOTING]: Initializing server...');

		const bootPhases = [
			PostgresDBPhase,
			PostgresDBMigrationPhase,
			ServerPhase
		];

		const initialValue: Promise<void> = Promise.resolve();

		return bootPhases
			.reduce(
				(chain: Promise<void>, Phase: new (...args: any[]) => BootPhase) =>
					chain.then(
						() => container.get<BootPhase>(Phase).execute(this)),
				initialValue
			)
			.then(() => { this.logger.info('[BOOTING] Application initialized!') })
			.catch((err) => {
				this.logger.error(err.stack);
				process.exit(1);
			})
	}
}
