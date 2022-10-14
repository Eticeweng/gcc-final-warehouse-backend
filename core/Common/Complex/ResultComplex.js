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
exports.ResultComplex = void 0;
var Complex_1 = require("./Complex");
var ResultComplex = /** @class */ (function (_super) {
    __extends(ResultComplex, _super);
    function ResultComplex(complexType, data) {
        if (data === void 0) { data = undefined; }
        return _super.call(this, complexType, false, data) || this;
    }
    Object.defineProperty(ResultComplex.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
        },
        enumerable: false,
        configurable: true
    });
    return ResultComplex;
}(Complex_1.Complex));
exports.ResultComplex = ResultComplex;
//# sourceMappingURL=ResultComplex.js.map