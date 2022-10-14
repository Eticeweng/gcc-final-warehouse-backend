"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prompt_sync_1 = __importDefault(require("prompt-sync"));
var Navigator_1 = require("./Navigator");
var BASE_DIR = "E:";
var PRE_READ_DEPTH = 1;
var navigator = new Navigator_1.Navigator();
var flag = true;
var prompt = (0, prompt_sync_1.default)({ sigint: true });
while (flag) {
    // console.log(`now: ${navigator.getCurrentPath()}`);
    // navigator.list().forEach(dirent => {
    //     console.log(`${dirent.name} ${dirent.isDirectory() ? "d" : "f"}`);
    // });
    var c = prompt("".concat(navigator.getCurrentPathArray().join("\\"), ">"));
    var complex = void 0;
    switch (c[0]) {
        case "n":
            complex = c.split(":");
            // @ts-ignore
            if (!navigator.forward(complex[1])) {
                console.warn("illegal path");
            }
            break;
        case "p":
            if (!navigator.backward()) {
                console.warn("illegal path");
            }
            break;
        case "l":
            // console.log("ls");
            navigator.list().forEach(function (dirent) {
                console.log(dirent.name, dirent.isDirectory() ? "D" : "F");
            });
            break;
        case "d":
            complex = c.split(":");
            console.log(navigator.getStat(complex[1]));
            break;
        case "e":
            flag = false;
            break;
        default:
            break;
    }
}
// console.log(f(BASE_DIR));
//# sourceMappingURL=__debug.js.map