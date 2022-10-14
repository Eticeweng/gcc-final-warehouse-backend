"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Navigator_1 = require("./FIleSystemAnalyzeTool/Navigator");
var NetworkResult_1 = require("./Common/NetworkResult");
var SERVER = (0, express_1.default)();
var PORT = 1389;
SERVER.use(express_1.default.json());
var BASE_DIR = "E:";
var navigator = new Navigator_1.Navigator();
SERVER.get("/ready", function (req, res, next) {
    console.log("".concat(req.ip, " ").concat(req.method, " ").concat(req.url, " ").concat(JSON.stringify(req.query)));
    NetworkResult_1.NetworkResult.send(navigator.locate(BASE_DIR), res);
});
SERVER.post("/go", function (req, res, next) {
    console.log("".concat(req.ip, " ").concat(req.method, " ").concat(req.url, " ").concat(JSON.stringify(req.body)));
    NetworkResult_1.NetworkResult.send(navigator.forward(req.body["where"]), res);
});
SERVER.post("/back", function (req, res, next) {
    console.log("".concat(req.ip, " ").concat(req.method, " ").concat(req.url, " ").concat(JSON.stringify(req.body)));
    NetworkResult_1.NetworkResult.send(navigator.backward(), res);
});
SERVER.post("/to", function (req, res, next) {
    console.log("".concat(req.ip, " ").concat(req.method, " ").concat(req.url, " ").concat(JSON.stringify(req.body)));
    NetworkResult_1.NetworkResult.send(navigator.locate(req.body["fullPath"]), res);
});
SERVER.listen(PORT, function () {
    console.log("server running on ".concat(PORT));
});
//# sourceMappingURL=__debug.js.map