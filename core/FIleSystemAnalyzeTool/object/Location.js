"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
var fs_1 = __importDefault(require("fs"));
var Location = /** @class */ (function () {
    function Location() {
    }
    Object.defineProperty(Location.prototype, "files", {
        get: function () {
            return this._files;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "currentStat", {
        get: function () {
            return this._currentStat;
        },
        enumerable: false,
        configurable: true
    });
    Location.prototype.locate = function (path) {
        try {
            this._files = fs_1.default.readdirSync(path, { withFileTypes: true });
            this._currentStat = fs_1.default.statSync(path);
        }
        catch (e) {
            throw e;
        }
    };
    return Location;
}());
exports.Location = Location;
//# sourceMappingURL=Location.js.map