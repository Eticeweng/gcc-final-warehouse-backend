export class Source {
    private readonly _TYPE: string;
    private readonly _SOURCE: string;

    constructor(TYPE: string, SOURCE: string) {
        this._TYPE = TYPE;
        this._SOURCE = SOURCE;
    }

    get TYPE(): string {
        return this._TYPE;
    }

    get SOURCE(): string {
        return this._SOURCE;
    }
}
