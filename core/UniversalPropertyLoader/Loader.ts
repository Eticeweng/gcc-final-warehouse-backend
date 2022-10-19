import yaml from "js-yaml";
import path from "path";
import {YAMLWorker} from "./YAMLWorker";
import {IWorker} from "./IWorker";
import {Complex} from "../Common/Complex/Complex";
import {ErrorComplex} from "../Common/Complex/ErrorComplex";
import {ResultComplex} from "../Common/Complex/ResultComplex";
import {MemoryWorker} from "./MemoryWorker";
import {DBWorker} from "./DBWorker";

export class Loader {
    // static
    // "path/to/place"
    public static readonly STATIC_LOCATION: string = path.resolve(__dirname, "../../configs") + "/";
    // db
    public static readonly DB_LOCATION: string = path.resolve(__dirname, "../../stores/db/") + "/";
    // memory
    private static workerStacks: Map<string, IWorker> = new Map<string, IWorker>();

    private static buildKey(args: string[]): string {
        let key: string = "";
        if (args.length == 1) {
            key = args[0];
        } else if (args.length == 2) {
            key = `${args[0]}_${args[1]}`;
        }
        return key;
    }

    public static createWorker(type: string, endPoint: string, key: string = `${type}_${endPoint}`): Complex<boolean> {
        try {
            switch (type) {
                case "static":
                    this.workerStacks.set(key, new YAMLWorker(endPoint));
                    break;
                case "db":
                    this.workerStacks.set(key, new DBWorker(endPoint));
                    break;
                case "mem":
                    this.workerStacks.set(key, new MemoryWorker(endPoint));
                    break;
                default:
                    return new ErrorComplex("LOADER", "WRKTYPENEXS", "worker type is not exists");
            }
        } catch (e) {
            return new ErrorComplex("LOADER", e.code, e.message);
        }
        return new ResultComplex("LOADER", true);
    }

    public static destroyWorker(key: string): Complex<boolean>;
    public static destroyWorker(type: string, endPoint: string): Complex<boolean>;
    public static destroyWorker(...args): Complex<boolean> {
        let key: string = "";
        if (args.length == 1) {
            key = args[0];
        } else if (args.length == 2) {
            key = `${args[0]}_${args[1]}`;
        } else {
            return new ErrorComplex("LOADER", "WRKKEYWARGN", "worker key args number not matched");
        }
        let worker = this.workerStacks.get(key);
        if (worker == null) {
            return new ErrorComplex("LOADER", "WRKKEYNEXS", "failed to destroy, worker not exists");
        }
        worker.flush();
        return new ResultComplex("LOADER", this.workerStacks.delete(key));
    }

    public static get<T>(propertyKey: string | Function, partition: string): Complex<T>;
    public static get<T>(propertyKey: string | Function, type: string, endPoint: string): Complex<T>;
    public static get<T>(propertyKey: string | Function, ...args): Complex<T> {
        let worker = this.workerStacks.get(this.buildKey(args));
        if (worker == null) {
            return new ErrorComplex("LOADER", "WRKKEYNEXS", `requested worker ${args} not exists`);
        }
        return new ResultComplex<T>("LOADER", worker.get<T>(propertyKey));
    }

    public static set<T>(propertyKey: string, property: T, partition: string): Complex<boolean>;
    public static set<T>(propertyKey: string, property: T, type: string, endPoint: string): Complex<boolean>;
    public static set<T>(propertyKey: string, property: T, ...args): Complex<boolean> {
        let worker = this.workerStacks.get(this.buildKey(args));
        if (worker == null) {
            return new ErrorComplex("LOADER", "WRKKEYNEXS", `requested worker ${args} not exists`);
        }
        if (worker.set(propertyKey, property)) {
            return new ResultComplex<boolean>("LOADER", true);
        }
        return new ErrorComplex("LOADER", "PRTNOTSET", `property ${propertyKey} is not set`);
    }

    public static close(): boolean {
        for (let worker of this.workerStacks) {
            worker[1].flush();
        }
        return false;
    }
}
