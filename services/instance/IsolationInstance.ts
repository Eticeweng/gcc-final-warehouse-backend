export class IsolationInstance {
    private _allowList: Set<string>;
    private _disallowList: Set<string>;
    private _defaultLevel: string;
    private _accessDepth: number;


    get allowList(): Set<string> {
        return this._allowList;
    }

    get disallowList(): Set<string> {
        return this._disallowList;
    }

    get defaultLevel(): string {
        return this._defaultLevel;
    }

    get accessDepth(): number {
        return this._accessDepth;
    }
}
