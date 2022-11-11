
export class Complex<T> {
    protected readonly _isError: boolean;
    protected readonly _errorCode: string;
    protected readonly _errorMessage: string;

    protected _data: T;

    private readonly _COMPLEX_TYPE: string;


    constructor(complexType: string, isError: boolean, data: T, errorCode?: string, errorMessage?: string) {
        this._COMPLEX_TYPE = complexType;
        this._isError = isError;
        this._data = data;
        this._errorCode = errorCode;
        this._errorMessage = errorMessage;
        if (isError) {
            // todo: replace with universal logger
            console.error(`${complexType}::${errorCode} ${errorMessage}`);
        }
    }

    get COMPLEX_TYPE(): string {
        return this._COMPLEX_TYPE;
    }

    get isError(): boolean {
        return this._isError;
    }

    get errorCode(): string {
        return this._errorCode;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    get data(): T {
        return this._data;
    }

}
