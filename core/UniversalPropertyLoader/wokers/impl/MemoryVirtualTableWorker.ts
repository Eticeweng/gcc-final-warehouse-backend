import {IWorker} from "../IWorker";

// this worker is designed to act as a temporary table, store any

export class MemoryVirtualTableWorker implements IWorker{
    readonly PHYSICAL_LOCATION: string;
    instance: any;
    protected readonly STRUCTURE: {};

    constructor(entryName: string, structure: {}, persist: boolean = false) {
        this.PHYSICAL_LOCATION = entryName;
        this.STRUCTURE = structure;
        this.instance = {};
    }

    get<T extends any[]>(propertyKey: string[], propertyID?: string): [...T] {
        if (!this.exists("", propertyID)) {
            return undefined;
        }
        let result = [];
        if (propertyKey.length == 1 && propertyKey[0] === "") {
            for (let entry of Object.entries(this.instance[propertyID])) {
                result.push(entry[1]);
            }
        } else {
            for (let i = 0; i < propertyKey.length; i++) {
                result.push(this.instance[propertyID][propertyKey[i]]);
            }
        }
        return result as [...T];
    }

    set<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        let object = {...this.STRUCTURE};
        for (let i = 0; i < propertyKeys.length; i++) {
            object[propertyKeys[i]] = properties[i];
        }
        try {
            this.instance[propertyID] = object;
        } catch (e) {
            throw e;
        }
        return true;
    }

    put<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        return this.set<T>(propertyKeys, properties, propertyID);
    }

    delete(propertyKey: string, propertyID?: string): boolean {
        if (propertyKey.length == 1 && propertyKey[0] === "") {
            return delete this.instance[propertyID];
        }
        try {
            return delete this.instance[propertyID][propertyKey];
        } catch (e) {
            throw e;
        }
    }

    exists(propertyKey: string, propertyID?: string): boolean {
        if (propertyKey === "") {
            return this.instance[propertyID] != null;
        }
        if (this.instance.hasOwnProperty(propertyID)) {
            return this.instance[propertyID][propertyKey] != null;
        }
        return false;
    }

    operate<T, R>(operator: (instance: T) => any): R {
        return operator(this.instance) as R;
    }

    flush(): boolean {
        return true;
    }

}
