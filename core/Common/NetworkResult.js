"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkResult = void 0;
var ErrorCodeMapper_1 = require("./ErrorCodeMapper/ErrorCodeMapper");
var NetworkResult = /** @class */ (function () {
    function NetworkResult() {
    }
    NetworkResult.send = function (complex, res) {
        res.status(complex.isError ? ErrorCodeMapper_1.ErrorCodeMapper.getCode(complex.COMPLEX_TYPE, complex.errorCode) : 200)
            .send({
            message: complex.errorMessage,
            data: complex.data
        });
    };
    return NetworkResult;
}());
exports.NetworkResult = NetworkResult;
//# sourceMappingURL=NetworkResult.js.map