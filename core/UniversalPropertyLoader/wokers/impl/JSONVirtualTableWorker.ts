import {IWorker} from "../IWorker";
import fs from "fs";
import {Loader} from "../../Loader";

export class JSONVirtualTableWorker implements IWorker {
    readonly PHYSICAL_LOCATION: string;
    instance: any;

    constructor(PHYSICAL_LOCATION: string) {
        this.PHYSICAL_LOCATION = Loader.STORE_LOCATION + PHYSICAL_LOCATION + ".json";
        this.instance = JSON.parse(fs.readFileSync(this.PHYSICAL_LOCATION, {encoding: "utf-8"}));
    }

    delete(propertyKey: string, propertyID?: string): boolean {
        if (propertyKey === "") {
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

    flush(): boolean {
        try {
            fs.writeFileSync(this.PHYSICAL_LOCATION, JSON.stringify(this.instance), {encoding: "utf-8"});
        } catch (e) {
            throw e;
        }
        return true;
    }

    get<T extends any[]>(propertyKey: string[], propertyID?: string): [...T] {
        if (!this.exists("", propertyID)) {
            return [undefined] as unknown as [...T];
        }
        let result = [];
        if (propertyKey.length == 1 && propertyKey[0] === "") {
            // for (let entry of Object.entries(this.instance[propertyID])) {
            //     result.push(entry[1]);
            // }
            result.push(this.instance[propertyID]);
        } else {
            for (let i = 0; i < propertyKey.length; i++) {
                result.push(this.instance[propertyID][propertyKey[i]]);
            }
        }
        return result as [...T];
    }

    operate<T, R>(operator: (instance: any) => any): R {
        return operator(this.instance) as R;
    }

    put<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        try {
            let object = {};
            for (let i = 0; i < propertyKeys.length; i++) {
                object[propertyKeys[i]] = properties[i];
            }
            this.instance[propertyID] = object;
        } catch (e) {
            throw e;
        }
        return true;
    }

    set<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        try {
            for (let i = 0; i < propertyKeys.length; i++) {
                this.instance[propertyID][propertyKeys[i]] = properties[i];
            }
        } catch (e) {
            throw e;
        }
        return true;
    }

}
