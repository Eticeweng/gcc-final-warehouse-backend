"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complex = void 0;
var Complex = /** @class */ (function () {
    function Complex(complexType, isError, data, errorCode, errorMessage) {
        this._COMPLEX_TYPE = complexType;
        this._isError = isError;
        this._data = data;
        this._errorCode = errorCode;
        this._errorMessage = errorMessage;
        if (isError) {
            // todo: replace with universal logger
            console.error("".concat(complexType, "::").concat(errorCode, " ").concat(errorMessage));
        }
    }
    Object.defineProperty(Complex.prototype, "COMPLEX_TYPE", {
        get: function () {
            return this._COMPLEX_TYPE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Complex.prototype, "isError", {
        get: function () {
            return this._isError;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Complex.prototype, "errorCode", {
        get: function () {
            return this._errorCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Complex.prototype, "errorMessage", {
        get: function () {
            return this._errorMessage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Complex.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    return Complex;
}());
exports.Complex = Complex;
//# sourceMappingURL=Complex.js.map