export class User {
    private _beacon: string;
    private _token: string;
    private _2faKey: string;
    private _name: string;
    private _permission: number;

    constructor(beacon: string, token: string, _2faKey: string, name: string, permission: number) {
        this._beacon = beacon;
        this._token = token;
        this._2faKey = _2faKey;
        this._name = name;
        this._permission = permission;
    }

    get beacon(): string {
        return this._beacon;
    }

    get token(): string {
        return this._token;
    }

    get __2faKey(): string {
        return this._2faKey;
    }

    get name(): string {
        return this._name;
    }

    get permission(): number {
        return this._permission;
    }

    set token(value: string) {
        this._token = value;
    }

    set name(value: string) {
        this._name = value;
    }
}
