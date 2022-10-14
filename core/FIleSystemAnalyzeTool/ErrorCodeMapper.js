"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodeMapper = void 0;
var ErrorCodeMapper = /** @class */ (function () {
    function ErrorCodeMapper() {
    }
    ErrorCodeMapper.getCode = function (errorCode) {
        console.log(errorCode);
        return this.CODE_MAP[errorCode];
    };
    ErrorCodeMapper.prototype.getCode = function (errorCode) {
        return 0;
    };
    ErrorCodeMapper.CODE_MAP = {
        "ENOENT": 404,
    };
    return ErrorCodeMapper;
}());
exports.ErrorCodeMapper = ErrorCodeMapper;
//# sourceMappingURL=ErrorCodeMapper.js.map