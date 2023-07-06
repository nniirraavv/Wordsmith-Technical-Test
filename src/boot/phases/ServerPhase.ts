import { join, resolve, sep } from "path";
import { container, Inject, Provide } from "../../context/IocProvider";
import { BootPhase } from "../BootPhase";
import { Application } from "../../context/Application";
import { LoggerFactory } from "../../context/components/LoggerFactory";
import { CONFIG } from "../../context/components/Configuration";
import { ApiDescriptor } from "../../types";
import { BaseRoute } from "../../routes/BaseRoute";
import { Rest } from "../../context/components/Rest";
import { ErrorHandlerMiddleware } from "../../middleware/ErrorHandlerMiddleware";
import { RouteMiddleware } from "../../middleware/RouteMiddleware";
import { HandleRequestMiddleware } from "../../middleware/HandleRequestMiddleware";
import { ValidationMiddleware } from "../../middleware/ValidationMiddleware";
import { FileSystem } from "../../utils/FileSystem";

@Provide(ServerPhase)
export class ServerPhase extends BootPhase {

	protected logger: Logger = LoggerFactory.getLogger("ServerPhase");
	private routesMiddleware: Array<RouteMiddleware>;

	constructor(
		@Inject(ErrorHandlerMiddleware) private errorHandlerMiddleware: ErrorHandlerMiddleware,
		@Inject(Rest) private rest: Rest
	) {
		super();
		this.routesMiddleware = [
			container.get<RouteMiddleware>(ValidationMiddleware),
			container.get<RouteMiddleware>(HandleRequestMiddleware)
		];
	}

	async execute(app: Application): Promise<void> {
		this.logger.info('[BOOTING] Initializing web server...');
		this.installComponents(app);

		this.logger.info('[BOOTING] Initializing REST services...');
		this.logger.info('[BOOTING] Scanning services folder and loading definitions');
		let p = resolve(join(__dirname, "../../routes"));
		let versions = FileSystem.getSubDirectories(p);
		versions.forEach(this.installApis.bind(this, app));


		this.installErrorHandler(app);
		this.logger.info('[BOOTING] REST services initialized!');

		this.logger.info('[BOOTING] Starting web server...');

		await new Promise<void>((resolve, reject) =>
			app.express.listen(CONFIG.port, (err?: Error) => err ? reject(err) : resolve())
		);

		this.logger.info(`[BOOTING] Web server is listening on port ${CONFIG.port}`);

	}

	private installComponents(app: Application): void {
		this.rest.init(app);
	}

	private installApis(app: Application, folder: string) {
		this.logger.debug(`[BOOTING] Initializing API's in ${folder}`);

		FileSystem.readdirSyncRecursive(folder)
			.filter(file => /\.(js)$/gi.test(file))
			.map(file => {
				let prototypeName = file.replace('.js', '');
				this.logger.debug(`[BOOTING] Initialize api ${prototypeName}`);
				let route = container.get<BaseRoute>(require(join(folder, file))[prototypeName]);
				return { prototypeName, route };
			})
			.filter(({ route }) => !!route)
			.forEach(({ route, prototypeName }) => {
				route.setApiVersion(folder.split(sep).pop()!);
				let descriptor = route.descriptor;
				this.logger.info(`[BOOTING] Service: ${prototypeName}. Loading paths descriptor`);

				for (let key in descriptor) {
					if (descriptor.hasOwnProperty(key)) {
						this.logger.debug(`[BOOTING] Found api: ${key}, path: ${descriptor[key].path} (method = ${descriptor[key].method})`);
						this.defineService(app, key, descriptor[key]);
					}
				}
			});
	}

	private installErrorHandler(app: Application) {
		app.express.use(this.errorHandlerMiddleware.sendError.bind(this.errorHandlerMiddleware));
	}

	private defineService(app: Application, idApi: string, apiDescriptor: ApiDescriptor) {
		let m = this.routesMiddleware.map(
			function (m) {
				return m.execute.bind(m, idApi, apiDescriptor);
			}
		);
		(<any>app.express)[apiDescriptor.method](apiDescriptor.path, m);
	}

}
