import {UUID} from "../../core/UUID";
import {Loader} from "../../core/UniversalPropertyLoader/Loader";
import {AuthService} from "../AuthService";
import {NavigationService} from "../NavigationService";

export class UserInstance {
    private readonly _userBeacon: string;
    private readonly _userInstanceID: string;
    private _browsingInstances: Set<string> = new Set();

    constructor(beacon: string) {
        this._userBeacon = beacon;
        this._userInstanceID = UUID.generate();
    }

    get userBeacon(): string {
        return this._userBeacon;
    }

    get userInstanceID(): string {
        return this._userInstanceID;
    }

    get browsingInstances(): Set<string> {
        return this._browsingInstances;
    }
}
