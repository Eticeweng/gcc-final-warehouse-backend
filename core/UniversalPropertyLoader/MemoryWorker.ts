import {IWorker} from "./IWorker";

export class MemoryWorker implements IWorker{
    readonly PHYSICAL_LOCATION: string;
    instance: any;
    private readonly TYPE = "MEM";

    constructor(entryName: string) {
        this.PHYSICAL_LOCATION = entryName;
        this.instance = {};
    }

    get<T = any>(propertyKey: string): T {
        return this.instance[propertyKey] as T;
    }

    set(propertyKey: string, property: any): boolean {
        this.instance[propertyKey] = property;
        return true;
    }

    flush(): boolean {
        return true;
    }

}
