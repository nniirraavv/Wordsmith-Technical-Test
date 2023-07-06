import { inject, Container } from "inversify"
import { buildProviderModule, fluentProvide } from "inversify-binding-decorators";

export const container = new Container({ autoBindInjectable: true });
container.load(buildProviderModule());

export function Provide(symbol: any): any {
    return fluentProvide(symbol).done();
}

export function Inject(symbol: any): any {
    return inject(symbol);
}

export function ProvideAsSingleton(symbol: any): any {
    return fluentProvide(symbol).inSingletonScope().done();
}