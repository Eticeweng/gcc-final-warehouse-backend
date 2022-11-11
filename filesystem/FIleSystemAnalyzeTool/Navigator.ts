import fs, {Stats} from "fs";
import {Location} from "./object/Location";
import {Complex} from "../../core/Complex/Complex";
import {ErrorComplex} from "../../core/Complex/impl/ErrorComplex";
import {ResultComplex} from "../../core/Complex/impl/ResultComplex";
import {Loader} from "../../core/UniversalPropertyLoader/Loader";

export class Navigator {
    private readonly TYPE = "FS";

    private current: Location = new Location();
    private path: string[] = [];

    private _inVoid: boolean = true;

    private inVoid() {
        if (this._inVoid) {
            throw {
                type: this.TYPE,
                code: "NAV_IN_VOID",
                message: "navigator is in void, please init first."
            }
        }
        // return new ErrorComplex(this.COMPLEX_TYPE, "NAV_IN_VOID",
        //     "navigator is in void, please init first.");
    }

    public forward(where: string): [string, any[]][] {
        this.inVoid();
        try {
            this.current.locate(`${this.path.join("\\")}\\${where}`);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
            // return new ErrorComplex(this.TYPE, e.code, e.message);
        }
        this.path.push(where);
        return this.list();
    }

    public backward(): [string, any[]][] {
        this.inVoid();
        let path = this.path.splice(0, this.path.length - 1);
        try {
            this.current.locate(`${path.join("\\")}`);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
            // return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path;
        return this.list();
    }

    public locate(path: string): [string, any[]][] {
        try {
            this.current.locate(path);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
            // return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path.split("\\");
        this._inVoid = false;
        return this.list();
    }

    public list(): [string, any[]][] {
        this.inVoid();
        let list: [string, any[]][] = [];
        let attributeFields = Loader.get<[string[]]>(["ExposedAttribute"], null, "static", "fsnav")[0];
        this.current.files.forEach(dirent => {
            try {
                let stat = fs.statSync(`${this.path.join("\\")}\\${dirent.name}`);
                let type = parseInt([+stat.isDirectory(), +stat.isFile(), +stat.isFIFO(), +stat.isSocket(),
                    +stat.isBlockDevice(), +stat.isCharacterDevice(), +stat.isSymbolicLink()].join(""), 2);
                let attributes = [];
                attributeFields.forEach(attribute => {
                    attributes.push(stat[attribute]);
                });
                list.push([dirent.name, [type, ...attributes]]);
            } catch (e) {
                return;
                // return new ErrorComplex("FS", e.code, e.message);
            }
        });
        return list;
        // return new ResultComplex<[string, any[]][]>("FS", list);
    }

    public getCurrentDirStat() {
        return this.current.currentStat;
    }

    public getStat(name): fs.Stats {
        try {
            return fs.statSync(`${this.path.join("\\")}\\${name}`);
        } catch (e) {
            return e;
        }
    }

    public getCurrentPathArray(): string[] {
        return this.path;
    }

    public currentPath(): string {
        return this.path.join("\\");
        // return new ResultComplex<string>("FS", this.path.join("\\"));
    }
}
