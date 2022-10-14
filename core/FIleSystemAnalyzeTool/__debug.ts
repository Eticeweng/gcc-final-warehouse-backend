import fs from "fs";
import readline from "readline";
import promptSync from "prompt-sync";

import {Navigator} from "./Navigator";
import {Location} from "./object/Location";

let BASE_DIR = "E:";
let PRE_READ_DEPTH = 1;

let navigator = new Navigator();

let flag = true;
const prompt = promptSync({sigint: true});

while (flag) {
    // console.log(`now: ${navigator.getCurrentPath()}`);
    // navigator.list().forEach(dirent => {
    //     console.log(`${dirent.name} ${dirent.isDirectory() ? "d" : "f"}`);
    // });
    let c: string = prompt(`${navigator.getCurrentPathArray().join("\\")}>`);
    let complex;
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
            navigator.list().forEach(dirent => {
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
