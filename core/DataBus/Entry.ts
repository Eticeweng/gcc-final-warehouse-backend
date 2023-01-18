import {IDriver} from "./driver/IDriver";

export class Entry<D extends IDriver<S>, S> {
    private readonly _TYPE = "ENTRY";
    private readonly _PHYSICAL_LOCATION: string;
    private readonly _NAME: string;
    private readonly _THIRD_PARTY_PROVIDED: boolean;
    driver: D;
    vault: Map<string, S> = new Map<string, S>();
    object: any;

    constructor(NAME: string, object: any);
    constructor(NAME: string, driver: D, PHYSICAL_LOCATION: string);
    constructor(NAME: string, param: any, PHYSICAL_LOCATION?: string) {
        this._NAME = NAME;
        this._THIRD_PARTY_PROVIDED = false;
        if (param["tpSerialize"] && param["serialize"]) {
            this._PHYSICAL_LOCATION = PHYSICAL_LOCATION;
            this.driver = param;
        } else {
            this.object = param;
            this._THIRD_PARTY_PROVIDED = true;
        }
    }

    get TYPE(): string {
        return this._TYPE;
    }

    get PHYSICAL_LOCATION(): string {
        return this._PHYSICAL_LOCATION;
    }

    get NAME(): string {
        return this._NAME;
    }

    get THIRD_PARTY_PROVIDED(): boolean {
        return this._THIRD_PARTY_PROVIDED;
    }

    load<A>(source: any) {
        try {
            if (this._THIRD_PARTY_PROVIDED) {
                this.object = this.driver.tpDeserialize<A>(source);
            } else {
                // this.vault = this.driver.deSerialize(this.PHYSICAL_LOCATION + source);
                this.vault.set(source, this.driver.deSerialize(this._PHYSICAL_LOCATION + "\\" + source));
            }
        } catch (e) {
            throw {
                type: this._TYPE,
                code: e.code || "DATA_ERROR",
                message: e.message || e,
                dataSlots: {
                    name: this._NAME
                }
            }
        }
    }

    flush(): boolean {
        try {
            if (this._THIRD_PARTY_PROVIDED) {
                return this.driver.tpSerialize(this.object);
            } else {
                [...this.vault.entries()].forEach(r => this.driver.serialize(r[1], this._PHYSICAL_LOCATION + "\\" + r[0]));
                return true;
            }
        } catch (e) {
            throw {
                type: this._TYPE,
                code: e.code || "FLUSH_FAIL",
                message: e.message || e,
                dataSlots: {
                    name: this._NAME
                }
            }
        }
    }

    get(key: string): S {
        try {
            return this.vault.get(key);
        } catch (e) {
            throw {
                type: this._TYPE,
                code: e.code || "GET_FAIL",
                message: e.message || e,
                dataSlots: {
                    key: key
                }
            }
        }
    }

    // insert(key: string, value: S): boolean {
    //     try {
    //         this.vault.set(key, value);
    //     }
    // }
    //
    // delete(key: string): boolean {}
    //
    // update<R extends any[]>(key: string, value: R, columnName: string[]): boolean {}
    //
    // select<R extends any[]>(key: string, columnName: string[]): R {}

}
