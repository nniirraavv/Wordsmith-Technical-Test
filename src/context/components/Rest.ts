import { ProvideAsSingleton } from "../IocProvider";
import { LoggerFactory } from "./LoggerFactory";
import { Application } from "../Application";
import { json, urlencoded } from "express";
const cors = require('cors');

@ProvideAsSingleton(Rest)
export class Rest {

    private logger: Logger;

    constructor() {
        this.logger = LoggerFactory.getLogger("Rest");
    }

    init(app: Application): void {
        this.logger.info("[BOOTING] Initializing REST");
        app.express.use(cors({ optionsSuccessStatus: 200 }))
        app.express.use(urlencoded({ extended: true }))
        app.express.use(json({ strict: true }));
    }
}
