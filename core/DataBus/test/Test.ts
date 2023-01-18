export class Test {
    private _ga: number;
    private _vs: boolean;


    get ga(): number {
        return this._ga;
    }

    set ga(value: number) {
        this._ga = value;
    }

    get vs(): boolean {
        return this._vs;
    }

    set vs(value: boolean) {
        this._vs = value;
    }
}
