"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorComplex = void 0;
var Complex_1 = require("./Complex");
var ErrorComplex = /** @class */ (function (_super) {
    __extends(ErrorComplex, _super);
    function ErrorComplex(complexType, errorCode, errorMessage) {
        return _super.call(this, complexType, true, undefined, errorCode, errorMessage) || this;
    }
    Object.defineProperty(ErrorComplex.prototype, "errorCode", {
        get: function () {
            return this._errorCode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ErrorComplex.prototype, "errorMessage", {
        get: function () {
            return this._errorMessage;
        },
        enumerable: false,
        configurable: true
    });
    return ErrorComplex;
}(Complex_1.Complex));
exports.ErrorComplex = ErrorComplex;
//# sourceMappingURL=ErrorComplex.js.map