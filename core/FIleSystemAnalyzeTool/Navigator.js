"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigator = void 0;
var fs_1 = __importDefault(require("fs"));
var Location_1 = require("./object/Location");
var ErrorComplex_1 = require("../Common/Complex/ErrorComplex");
var ResultComplex_1 = require("../Common/Complex/ResultComplex");
var Navigator = /** @class */ (function () {
    function Navigator() {
        this.COMPLEX_TYPE = "FS";
        this.current = new Location_1.Location();
        this.path = [];
        this._inVoid = true;
    }
    Navigator.prototype.inVoid = function () {
        return new ErrorComplex_1.ErrorComplex(this.COMPLEX_TYPE, "NAVINVOID", "navigator is in void, please init first.");
    };
    Navigator.prototype.forward = function (where) {
        if (this._inVoid) {
            return this.inVoid();
        }
        try {
            this.current.locate("".concat(this.path.join("\\"), "\\").concat(where));
        }
        catch (e) {
            return new ErrorComplex_1.ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path.push(where);
        var files = [];
        for (var _i = 0, _a = this.current.files; _i < _a.length; _i++) {
            var file = _a[_i];
            files.push([file.name, file.isDirectory() ? "D" : "F"]);
        }
        return new ResultComplex_1.ResultComplex(this.COMPLEX_TYPE, files);
    };
    Navigator.prototype.backward = function () {
        if (this._inVoid) {
            return this.inVoid();
        }
        var path = this.path.splice(0, this.path.length - 1);
        try {
            this.current.locate("".concat(path.join("\\")));
        }
        catch (e) {
            return new ErrorComplex_1.ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path;
        var files = [];
        for (var _i = 0, _a = this.current.files; _i < _a.length; _i++) {
            var file = _a[_i];
            files.push([file.name, file.isDirectory() ? "D" : "F"]);
        }
        return new ResultComplex_1.ResultComplex(this.COMPLEX_TYPE, files);
    };
    Navigator.prototype.locate = function (path) {
        try {
            this.current.locate(path);
        }
        catch (e) {
            return new ErrorComplex_1.ErrorComplex(this.COMPLEX_TYPE, e.code, e.message);
        }
        this.path = path.split("\\");
        this._inVoid = false;
        var files = [];
        for (var _i = 0, _a = this.current.files; _i < _a.length; _i++) {
            var file = _a[_i];
            files.push([file.name, file.isDirectory() ? "D" : "F"]);
        }
        return new ResultComplex_1.ResultComplex(this.COMPLEX_TYPE, files);
    };
    Navigator.prototype.list = function () {
        return this.current.files;
    };
    Navigator.prototype.getCurrentDirStat = function () {
        return this.current.currentStat;
    };
    Navigator.prototype.getStat = function (name) {
        try {
            return fs_1.default.statSync("".concat(this.path.join("\\"), "\\").concat(name));
        }
        catch (e) {
            return e;
        }
    };
    Navigator.prototype.getCurrentPathArray = function () {
        return this.path;
    };
    return Navigator;
}());
exports.Navigator = Navigator;
//# sourceMappingURL=Navigator.js.map