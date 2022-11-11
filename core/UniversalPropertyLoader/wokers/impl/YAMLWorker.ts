import yaml from "js-yaml";
import {IWorker} from "../IWorker";
import fs from "fs";
import {Loader} from "../../Loader";

export class YAMLWorker implements IWorker{
    instance: {};
    readonly PHYSICAL_LOCATION: string;
    private readonly TYPE = "STATIC";

    constructor(endPoint: string, encoding: BufferEncoding = "utf-8") {
        let location = Loader.STATIC_LOCATION + endPoint + ".yaml";
        try {
            this.instance = yaml.load(fs.readFileSync(location, {encoding: encoding}));
        } catch (e) {
            throw e;
        }
        this.PHYSICAL_LOCATION = location;
    }

    get<T extends any[]>(propertyKey: string[], propertyID?: string): [...T] {
        let values = [];
        propertyKey.forEach(propertyKey => {
            let path = propertyKey.split("/");
            let value = this.instance;
            for (let layer of path) {
                try {
                    value = value[layer];
                } catch (e) {
                    throw e;
                }
            }
            values.push(value);
        });
        return values as [...T];
    }

    set<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        for (let i = 0; i < propertyKeys.length; i++) {
            let path = propertyKeys[i].split("/");
            let target = this.instance;
            for (let j = 0; j < path.length - 1; j++) {
                let level = path[j];
                if (!target.hasOwnProperty(level)) {
                    target[level] = {}; // create path if no object below
                }
                target[level] = Object.prototype.toString.call(target[level]) == "[object Object]" ? target[level] : {};
                target = target[level];
            }
            try {
                target[path.at(-1)] = properties[i];
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
        let path = propertyKey.split("/");
        let target = this.instance;
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                return delete target[path[i]];
            }
            target = target[path[i]];
        }
        return false;
    }

    exists(propertyKey: string, propertyID?: string): boolean {
        let path = propertyKey.split("/");
        let beacon = this.instance;
        for (let layer of path) {
            if (beacon.hasOwnProperty(layer)) {
                beacon = beacon[layer];
                continue;
            }
            return false;
        }
        return true;
    }

    operate<T, R>(operator: (instance: T | any) => any): R {
        return operator(this.instance) as R;
    }

    flush(): boolean {
        try {
            fs.writeFileSync(this.PHYSICAL_LOCATION, yaml.dump(this.instance));
        } catch (e) {
            throw e;
        }
        return true;
    }


}
