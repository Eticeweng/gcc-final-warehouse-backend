import {Navigator} from "../../filesystem/FIleSystemAnalyzeTool/Navigator";
import {Complex} from "../../core/Complex/Complex";

export class Navigation {
    private navigator: Navigator;
    private readonly BASE_DIR: string;
    private _currentLevel: number;
    private __SLOT__: any;

    private _userInstanceID: string;

    constructor(userInstanceID: string, baseDir: string) {
        this._userInstanceID = userInstanceID;
        this.BASE_DIR = baseDir;
        this.navigator = new Navigator();
    }


    get currentLevel(): number {
        return this._currentLevel;
    }

    get userInstanceID(): string {
        return this._userInstanceID;
    }

    ready(): [string, [string, any[]][]] {
        let result = this.navigator.locate(this.BASE_DIR);
        this._currentLevel = 0;
        return result;
    }

    forward(where: string): [string, [string, any[]][]] {
        let result = this.navigator.forward(where);
        this._currentLevel += 1;
        return result;
    }

    backward(): [string, [string, any[]][]] {
        let result = this.navigator.backward();
        this._currentLevel -= 1;
        return result;
    }

    locate(fullPath: string): [string, [string, any[]][]] {
        let result = this.navigator.locate(fullPath);
        this._currentLevel = this.navigator.currentPathArray.length;
        return result;
    }

    listDirectory(): [string, any[]][] {
        return this.navigator.list();
    }
}
