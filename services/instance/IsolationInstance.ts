export class IsolationInstance {
    private _allowLevels: {[path: string]: {accessDepth: number}};
    private _excludeLevels: string[];

    constructor(proxyObject: {}) {
        this._allowLevels = proxyObject["allowLevels"];
        this._excludeLevels = proxyObject["excludeLevels"];
    }


    get allowLevels(): { [p: string]: { accessDepth: number } } {
        return this._allowLevels;
    }

    set allowLevels(value: { [p: string]: { accessDepth: number } }) {
        this._allowLevels = value;
    }

    get excludeLevels(): string[] {
        return this._excludeLevels;
    }

    set excludeLevels(value: string[]) {
        this._excludeLevels = value;
    }
}
