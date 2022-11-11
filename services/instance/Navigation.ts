import {Navigator} from "../../filesystem/FIleSystemAnalyzeTool/Navigator";
import {Complex} from "../../core/Complex/Complex";

export class Navigation {
    private navigator: Navigator;
    private readonly BASE_DIR: string;
    private __SLOT__: any;

    private _userInstanceID: string;

    constructor(userInstanceID: string, baseDir: string) {
        this._userInstanceID = userInstanceID;
        this.BASE_DIR = baseDir;
        this.navigator = new Navigator();
    }

    get userInstanceID(): string {
        return this._userInstanceID;
    }

    ready(): [string, any[]][] {
        return this.navigator.locate(this.BASE_DIR);
    }

    forward(where: string): [string, any[]][] {
        return this.navigator.forward(where);
    }

    backward(): [string, any[]][] {
        return this.navigator.backward();
    }

    listDirectory(): [string, any[]][] {
        return this.navigator.list();
    }
}
