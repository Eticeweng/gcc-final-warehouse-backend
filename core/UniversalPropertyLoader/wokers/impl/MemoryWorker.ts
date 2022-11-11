import {IWorker} from "../IWorker";

// this worker is designed to hold some temporary data, use as a hub, transmit data remotely, access them anywhere

export class MemoryWorker implements IWorker{
    readonly PHYSICAL_LOCATION: string;
    instance: any;
    private readonly TYPE = "MEM";

    constructor(entryName: string) {
        this.PHYSICAL_LOCATION = entryName;
        this.instance = {};
    }

    get<T extends any[]>(propertyKey: string[], propertyID?: string): [...T] {
        let result = [];
        propertyKey.forEach(propertyKey => {
            result.push(this.instance[propertyKey] as T);
        });
        return result as [...T];
    }

    set<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        for (let i = 0; i < propertyKeys.length; i++) {
            try {
                this.instance[propertyKeys[i]] = properties[i];
            } catch (e) {
                throw e;
            }
        }
        return true;
    }

    put<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        try {
            return this.set<T>(propertyKeys, properties, propertyID);
        } catch (e) {
            throw e;
        }
    }

    delete(propertyKey: string, propertyID?: string): boolean {
        return delete this.instance[propertyKey];
    }

    exists(propertyKey: string, propertyID?: string): boolean {
        return this.instance[propertyKey] != undefined;
    }

    operate<T, R>(operator: (instance: T | any) => any): R {
        return operator(this.instance) as R;
    }

    flush(): boolean {
        return true;
    }

}
