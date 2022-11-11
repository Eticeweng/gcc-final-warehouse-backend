import {Complex} from "../Complex";

export class ErrorComplex extends Complex<any> {

    constructor(complexType: string, errorCode: string, errorMessage: string) {
        super(complexType, true, undefined, errorCode, errorMessage);
    }

    public get errorCode(): string {
        return this._errorCode;
    }

    public get errorMessage(): string {
        return this._errorMessage;
    }
}
