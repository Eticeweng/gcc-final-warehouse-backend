import fs from "fs";

export class Location {
    // private _currentLevel: fs.Dir;
    private _files: fs.Dirent[];
    private _currentStat: fs.Stats;

    get files(): fs.Dirent[] {
        return this._files;
    }

    get currentStat(): fs.Stats {
        return this._currentStat;
    }

    public locate(path) {
        try {
            this._files = fs.readdirSync(path, {withFileTypes: true});
            this._currentStat = fs.statSync(path);
        } catch (e) {
            throw e;
        }
    }
}
