import fs, {Stats} from "fs";
import {Location} from "./object/Location";
import {Complex} from "../Common/Complex/Complex";
import {ErrorComplex} from "../Common/Complex/impl/ErrorComplex";
import {ResultComplex} from "../Common/Complex/impl/ResultComplex";
import {Loader} from "../UniversalPropertyLoader/Loader";

export class Navigator {
    private readonly COMPLEX_TYPE = "FS";

    private current: Location = new Location();
    private path: string[] = [];

    private _inVoid: boolean = true;

    private inVoid() {
        return new ErrorComplex(this.COMPLEX_TYPE, "NAVINVOID", "navigator is in void, please init first.");
    }

    public forward(where: string): Complex<[string, any[]][]> {
        if (this._inVoid) {
            return this.inVoid();
        }
        try {
            this.current.locate(`${this.path.join("\\")}\\${where}`);
        } catch (e) {
            return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path.push(where);
        return this.list();
    }

    public backward(): Complex<[string, any[]][]> {
        if (this._inVoid) {
            return this.inVoid();
        }
        let path = this.path.splice(0, this.path.length - 1);
        try {
            this.current.locate(`${path.join("\\")}`);
        } catch (e) {
            return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path;
        return this.list();
    }

    public locate(path: string): Complex<[string, any[]][]> {
        try {
            this.current.locate(path);
        } catch (e) {
            return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path.split("\\");
        this._inVoid = false;
        return this.list();
    }

    public list(): Complex<[string, any[]][]> {
        let list: [string, any[]][] = [];
        let attributeFileds = Loader.get<string[]>("ExposedAttribute", "static", "fsnav").data;
        this.current.files.forEach(dirent => {
            try {
                let stat = fs.statSync(`${this.path.join("\\")}\\${dirent.name}`);
                let type = parseInt([+stat.isDirectory(), +stat.isFile(), +stat.isFIFO(), +stat.isSocket(),
                    +stat.isBlockDevice(), +stat.isCharacterDevice(), +stat.isSymbolicLink()].join(""), 2);
                let attributes = [];
                attributeFileds.forEach(attribute => {
                    attributes.push(stat[attribute]);
                });
                list.push([dirent.name, [type, ...attributes]]);
            } catch (e) {
                return new ErrorComplex("FS", e.code, e.message);
            }
        });
        return new ResultComplex<[string, any[]][]>("FS", list);
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

    public currentPath(): Complex<string> {
        return new ResultComplex<string>("FS", this.path.join("\\"));
    }
}
