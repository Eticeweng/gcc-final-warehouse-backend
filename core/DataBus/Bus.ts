
import {Complex} from "../Complex/Complex";
import {ErrorComplex} from "../Complex/impl/ErrorComplex";

export class Bus {


    static insert<T>(propertyKey: string, property: T, sourceKey: string): Complex<T> {
        try {

        } catch (e) {
            // return ErrorComplex(this.TYPE, e.code, );
        }
        return null;
    }

    static delete(): boolean {
        return false;
    }

    static update(): boolean {
        return false;
    }

    static select(): boolean {
        return false;
    }
}
