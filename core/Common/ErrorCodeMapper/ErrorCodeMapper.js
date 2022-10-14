"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodeMapper = void 0;
var FS_1 = __importDefault(require("./mapper/FS"));
var ErrorCodeMapper = /** @class */ (function () {
    function ErrorCodeMapper() {
    }
    ErrorCodeMapper.getCode = function (complexType, errorCode) {
        var code = this.MAPPER_MAP[complexType][errorCode];
        if (code == undefined) {
            console.warn("error code ".concat(complexType, "::").concat(errorCode, " is not defined"));
            // throw Error();
            return 500;
        }
        return code;
    };
    ErrorCodeMapper.MAPPER_MAP = {
        "FS": FS_1.default
    };
    return ErrorCodeMapper;
}());
exports.ErrorCodeMapper = ErrorCodeMapper;
//# sourceMappingURL=ErrorCodeMapper.js.map