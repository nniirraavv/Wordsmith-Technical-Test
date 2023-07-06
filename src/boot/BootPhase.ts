import { Provide } from "../context/IocProvider";
import { Application } from "../context/Application";

@Provide(BootPhase)
export abstract class BootPhase {

    protected abstract logger: Logger;

    abstract execute(app: Application): void;
}