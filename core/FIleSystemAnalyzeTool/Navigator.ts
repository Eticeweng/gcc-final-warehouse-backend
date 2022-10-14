import fs, {Stats} from "fs";
import {Location} from "./object/Location";
import {Complex} from "../Common/Complex/Complex";
import {ErrorComplex} from "../Common/Complex/ErrorComplex";
import {ResultComplex} from "../Common/Complex/ResultComplex";

export class Navigator {
    private readonly COMPLEX_TYPE = "FS";

    private current: Location = new Location();
    private path: string[] = [];

    private _inVoid: boolean = true;

    private inVoid() {
        return new ErrorComplex(this.COMPLEX_TYPE, "NAVINVOID", "navigator is in void, please init first.");
    }

    public forward(where: string): Complex<[string, string][]> {
        if (this._inVoid) {
            return this.inVoid();
        }
        try {
            this.current.locate(`${this.path.join("\\")}\\${where}`);
        } catch (e) {
            return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path.push(where);
        let files: [string, string][] = [];
        for (let file of this.current.files) {
            files.push([file.name, file.isDirectory() ? "D" : "F"]);
        }
        return new ResultComplex<[string, string][]>(this.COMPLEX_TYPE, files);
    }

    public backward(): Complex<[string, string][]> {
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
        let files: [string, string][] = [];
        for (let file of this.current.files) {
            files.push([file.name, file.isDirectory() ? "D" : "F"]);
        }
        return new ResultComplex<[string, string][]>(this.COMPLEX_TYPE, files);
    }

    public locate(path: string): Complex<[string, string][]> {
        try {
            this.current.locate(path);
        } catch (e) {
            return new ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path.split("\\");
        this._inVoid = false;
        let files: [string, string][] = [];
        for (let file of this.current.files) {
            files.push([file.name, file.isDirectory() ? "D" : "F"]);
        }
        return new ResultComplex<[string, string][]>(this.COMPLEX_TYPE, files);
    }

    public list(): fs.Dirent[] {
        return this.current.files;
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
}
