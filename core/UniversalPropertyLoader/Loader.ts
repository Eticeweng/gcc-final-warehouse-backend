import path from "path";
import {IWorker} from "./wokers/IWorker";
import {Complex} from "../Complex/Complex";
import {ErrorComplex} from "../Complex/impl/ErrorComplex";
import {ResultComplex} from "../Complex/impl/ResultComplex";


// this is a wierd tool, designed to assist me on developing
// the core feature of this tool is to centralize every data source, loading, extracting, modifying, setting and deleting
// we treat every data source(usually a single file or a piece of data in memory) as a Worker,
// then unify them into this Loader using almost the same rule to access

export class Loader {
    // general
    public static readonly STORE_LOCATION: string = path.resolve(__dirname, "../../../stores/") + "/";
    // static
    // "path/to/place"
    public static readonly STATIC_LOCATION: string = path.resolve(__dirname, "../../../stores/configs") + "/";
    // db
    public static readonly DB_LOCATION: string = path.resolve(__dirname, "../../../stores/db/") + "/";
    // memory
    private static workerStacks: Map<string, IWorker> = new Map<string, IWorker>();

    private static readonly TYPE: string = "LOADER";

    public static buildKey(args: string[]): string {
        if (args.length == 1) {
            return args[0];
        } else if (args.length == 2) {
            return `${args[0]}_${args[1]}`;
        }
        throw SyntaxError("worker key args pattern mismatched, required 1 or 2");
    }

    private static getWorker(workerKey: string): IWorker {
        let worker = this.workerStacks.get(workerKey);
        if (worker == null) {
            throw {
                type: this.TYPE,
                code: "WRK_KEY_NEXS",
                message: `requested worker ${workerKey} not exists`
            }
        }
        return worker;
    }

    public static assignWorker(worker: IWorker, key: string);
    public static assignWorker(worker: IWorker, type: string, endPoint: string);
    public static assignWorker(worker: IWorker, ...args: string[]) {
        try {
            this.workerStacks.set(this.buildKey(args), worker);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: "WRK_SET_FAILED",
                message: e.message
            }
            // return new ErrorComplex("LOADER", e.code, e.message);
        }
        // return new ResultComplex("LOADER", true);
    }

    public static removeWorker(key: string): boolean;
    public static removeWorker(type: string, endPoint: string): boolean;
    public static removeWorker(...args: string[]): boolean {
        // let worker = this.workerStacks.get(workerKey);
        // if (worker == null) {
        //     // return new ErrorComplex("LOADER", "WRK_KEY_NEXS", "unable to remove not exists worker");
        //     throw {
        //         code: "WRK_KEY_NEXS",
        //         message: "unable to remove not exists worker"
        //     }
        // }
        try {
            let workerKey = this.buildKey(args);
            this.workerStacks.get(workerKey).flush();
            return this.workerStacks.delete(workerKey);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: "WRK_FLUSH_FAILED",
                message: e.message
            }
            // return new ErrorComplex("LOADER", "WRK_FLUSH_FAILED", e.message);
        }
        // try {
        //
        //
        //     return new ResultComplex("LOADER", );
        // } catch (e) {
        //     return new ErrorComplex("LOADER", e.code, e.message);
        // }
    }

    public static get<T extends any[]>(propertyKeys: string[], propertyID: string, partition: string): [...T];
    public static get<T extends any[]>(propertyKeys: string[], propertyID: string, type: string, endPoint: string): [...T];
    public static get<T extends any[]>(propertyKeys: string[], propertyID: string, ...args: string[]): [...T] {

        try {
            let worker = this.getWorker(this.buildKey(args));
            return worker.get<T>(propertyKeys, propertyID) as [...T];
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    // modify exists
    public static set<T extends any[]>(propertyKeys: string[], propertyID: string, properties: T, partition: string): Complex<boolean>;
    public static set<T extends any[]>(propertyKeys: string[], propertyID: string, properties: T, type: string, endPoint: string): Complex<boolean>;
    public static set<T extends any[]>(propertyKeys: string[], propertyID: string, properties: T, ...args): Complex<boolean> {
        if (properties.length != propertyKeys.length) {
            throw {
                type: this.TYPE,
                code: "PUT_ARG_INDEX_NMATCH",
                message: `${propertyKeys.length} key shown but ${properties.length} property provided`
            }
            // return new ErrorComplex("LOADER", "PUT_ARG_NUM_NMATCH", `${propertyKeys.length} key shown but ${properties.length} property provided`);
        }
        let worker = this.workerStacks.get(this.buildKey(args));
        if (worker == null) {
            return new ErrorComplex("LOADER", "WRK_KEY_NEXS", `requested worker ${args} not exists`);
        }
        try {
            return new ResultComplex<boolean>("LOADER", worker.set<T>(propertyKeys, properties, propertyID));
        } catch (e) {
            return new ErrorComplex("LOADER", "PRT_NOT_SET", `property ${propertyKeys} is not set, ${e.message}`);
        }
    }

    // add new
    public static put<T extends any[]>(propertyKeys: string[], propertyID: string, properties: T, partition: string): boolean;
    public static put<T extends any[]>(propertyKeys: string[], propertyID: string, properties: T, type: string, endPoint: string): boolean;
    public static put<T extends any[]>(propertyKeys: string[], propertyID: string, properties: T, ...args): boolean {
        if (properties.length != propertyKeys.length) {
            throw {
                type: this.TYPE,
                code: "PUT_ARG_INDEX_NMATCH",
                message: `${propertyKeys.length} key shown but ${properties.length} property provided`
            }
            // return new ErrorComplex("LOADER", "PUT_ARG_NUM_NMATCH", `${propertyKeys.length} key shown but ${properties.length} property provided`);
        }
        try {
            let worker = this.getWorker(this.buildKey(args));
            return worker.put<T>(propertyKeys, properties, propertyID);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: "PRT_NOT_SET",
                message: `property ${propertyKeys} is not put, ${e.message}`
            }
        }

        // try {
        //     return new ResultComplex<boolean>("LOADER", );
        // } catch (e) {
        //     return new ErrorComplex("LOADER", "PRT_NOT_SET", `property ${propertyKeys} is not put, ${e.message}`);
        // }
    }

    public static operate<T, R>(operator: ((instance: T) => any), partition: string): R;
    public static operate<T, R>(operator: ((instance: T) => any), type: string, endPoint: string): R;
    public static operate<T, R>(operator: ((instance: T) => any), ...args): R {
        try {
            let worker = this.getWorker(this.buildKey(args));
            return worker.operate<T, R>(operator);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
        }
        // let worker = this.workerStacks.get(this.buildKey(args));
        // if (worker == null) {
        //     return new ErrorComplex("LOADER", "WRK_KEY_NEXS", `requested worker ${args} not exists`);
        // }
        // try {
        //     return new ResultComplex("LOADER", worker.operate<T, R>(operator));
        // } catch (e) {
        //     return new ErrorComplex("LOADER", e.code, e.message);
        // }
    }

    public static delete(propertyKey: string, propertyID: string, partition: string): boolean;
    public static delete(propertyKey: string, propertyID: string, type: string, endPoint: string): boolean;
    public static delete(propertyKey: string, propertyID: string, ...args): boolean {
        try {
            let worker = this.getWorker(this.buildKey(args));
            return worker.delete(propertyKey, propertyID);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
        }
        // let worker = this.workerStacks.get(this.buildKey(args));
        // if (worker == null) {
        //     return new ErrorComplex("LOADER", "WRK_KEY_NEXISTS", `requested worker ${args} not exists`);
        // }
        // try {
        //     return new ResultComplex("LOADER", worker.delete(propertyKey, propertyID));
        // } catch (e) {
        //     return new ErrorComplex("LOADER", e.code, e.message);
        // }
    }

    public static exists(propertyKey: string, propertyID: string, partition: string): boolean;
    public static exists(propertyKey: string, propertyID: string, type: string, endPoint: string): boolean;
    public static exists(propertyKey: string, propertyID: string, ...args): boolean {
        try {
            let worker = this.getWorker(this.buildKey(args));
            return worker.exists(propertyKey, propertyID);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
        }
        // let worker = this.workerStacks.get(this.buildKey(args));
        // if (worker == null) {
        //     return new ErrorComplex("LOADER", "WRK_KEY_NEXS", `requested worker ${args} not exists`);
        // }
        // try {
        //     return new ResultComplex("LOADER", worker.exists(propertyKey, propertyID));
        // } catch (e) {
        //     return new ErrorComplex("LOADER", e.code, e.message);
        // }
    }

    public static close(): boolean {
        for (let worker of this.workerStacks) {
            try {
                worker[1].flush();
            } catch (e) {
                throw {
                    type: this.TYPE,
                    code: e.code,
                    message: e.message
                }
                // new ErrorComplex("LOADER", "WRK_FLUSH_FAILED", e.message);
                // flag = false;
            }
        }
        return true
    }
}
