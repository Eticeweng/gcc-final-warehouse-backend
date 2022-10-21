import {Complex} from "../Complex";

export class ResultComplex<T> extends Complex<T> {

    constructor(complexType: string, data: T = undefined) {
        super(complexType, false, data);
    }

    public get data(): T {
        return this._data;
    }

    public set data(data: T) {
        this._data = data;
    }
}
