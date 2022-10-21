import yaml from "js-yaml";
import {IWorker} from "../IWorker";
import fs from "fs";
import {Loader} from "../../Loader";

export class YAMLWorker implements IWorker{
    instance: {};
    readonly PHYSICAL_LOCATION: string;
    private readonly TYPE = "STATIC";

    constructor(endPoint: string) {
        let location = Loader.STATIC_LOCATION + endPoint + ".yaml";
        try {
            this.instance = yaml.load(fs.readFileSync(location, {encoding: "utf-8"}));
        } catch (e) {
            throw e;
        }
        this.PHYSICAL_LOCATION = location;
    }

    public get<T = any>(propertyKey: string): T {
        let path = propertyKey.split("/");
        let value = this.instance;
        for (let layer of path) {
            try {
                value = value[layer];
            } catch (e) {
                throw e;
            }
        }
        return value as T;
    }

    public set(propertyKey: string, property: any): boolean {
        let path = propertyKey.split("/");
        let target = this.instance;
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                target[path[i]] = property;
                return true;
            }
            target = target[path[i]];
        }
        return false;
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
