import express from "express";
import {Navigator} from "../filesystem/FIleSystemAnalyzeTool/Navigator";
import {NetworkResult} from "./NetworkResult";
import {Loader} from "./UniversalPropertyLoader/Loader";
import Database from "better-sqlite3";
import {DBWorker} from "./UniversalPropertyLoader/wokers/impl/DBWorker";
import {YAMLWorker} from "./UniversalPropertyLoader/wokers/impl/YAMLWorker";
import {MemoryWorker} from "./UniversalPropertyLoader/wokers/impl/MemoryWorker";
import {MemoryVirtualTableWorker} from "./UniversalPropertyLoader/wokers/impl/MemoryVirtualTableWorker";
import {User} from "../permission/User";

// init

Loader.assignWorker(new YAMLWorker("server"), "static", "server");
Loader.assignWorker(new YAMLWorker("test"), "static", "test");
Loader.assignWorker(new YAMLWorker("fsnav"), "static", "fsnav");

Loader.assignWorker(new DBWorker("test", "test"), "db::test@test");
Loader.assignWorker(new DBWorker("test", "nasq"), "db", "nasq");

// console.log(Loader.get<string>("SMDG/B/AR", "static", "test"));


const SERVER = express();
const PORT = Loader.get<[number]>(["Port"], null, "static", "server")[0];
const HOST = Loader.get<[string]>(["Hostname"], null, "static", "server")[0];
const NOT_EXISTS = Loader.get<[string, number, string]>(["P", "Port", "Hostname"], null, "static", "server");
let attributeFields = Loader.get<[string[], number]>(["ExposedAttribute", "Vcast"], null, "static", "fsnav");

console.log(PORT, HOST, NOT_EXISTS, attributeFields);

// console.log(Loader.get<[string, string]>(["foo", "bar"], "vd1", "db::test@test"));
// console.log(Loader.get<[string]>(["foo"], "xd1", "db", "nasq")[0]);
// console.log(Loader.get(["*"], "vd1", "db::test@test"));
// // console.log(Loader.set<string>("foo", "xv2", "lance", "db", "nasq"));
// // console.log(Loader.set<string>(["foo", "bar"].join(","), "kns1", ["'vdx1'", "'mks2'"].join(","), "db::test@test"));
// console.log(Loader.get<[string, string]>(["foo", "bar"], "kns1", "db::test@test"));

// Loader.assignWorker(new YAMLWorker("test"), "static", "test");
// console.log(Loader.get<[string, string]>(["Ren/Rxy", "SMDG/B/AR"], null, "static", "test"));
// console.log(Loader.delete("Ren/Rdy", null, "static", "test"));
// console.log(Loader.get<[string, string]>(["Ren/Rdy", "SMDG/B/AR"], null, "static", "test"));
// console.log(Loader.set(["Ren/mcc", "etf"], null, ["grx"], "static", "test"));
// console.log(Loader.exists("0v", null, "static", "test"));
// console.log(Loader.exists("Ren/U81920xa", null, "static", "test"));
//
// Loader.assignWorker(new MemoryWorker("main"), "mem", "main");

Loader.assignWorker(
    new MemoryVirtualTableWorker("test", {name: "", value: ""}), "mvt", "test"
);
Loader.set<[string, number]>(["name", "value"], "1ff2a", ["gas", 122], "mvt", "test");
console.log(Loader.get<[string, number]>(["name"], "1ff2a", "mvt", "test"));
console.log(Loader.exists("", "1ff2a", "mvt", "test"));
console.log(Loader.get<[string, number]>([""], "1f22a", "mvt", "test"));
console.log(Loader.operate<{}, {}>((instance) => {
    return instance;
}, "mvt", "test"));
console.log(Loader.close());





SERVER.use(express.json());
SERVER.use((req, res, next) => {
    res.setHeader("Cache-Control", "must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const BASE_DIR = "E:";

// Loader.createWorker("static", "fsnav");
let navigator = new Navigator();

SERVER.get("/ready", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    // NetworkResult.send(navigator.locate(BASE_DIR), res);
});

SERVER.post("/go", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    // NetworkResult.send(navigator.forward(req.body["where"]), res);
});

SERVER.get("/back", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    // NetworkResult.send(navigator.backward(), res);
});

SERVER.post("/to", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    // NetworkResult.send(navigator.locate(req.body["fullPath"]), res);
});

SERVER.get("/pwd", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    // NetworkResult.send(navigator.currentPath(), res);
});

SERVER.get("/list", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    // NetworkResult.send(navigator.list(), res);
});

// SERVER.get("/gvm", (req, res, next) => {
//     console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
//     NetworkResult.send(Loader.get(`bar@${req.query["id"]}`, "db", "test@SVN"), res);
// });
//
// SERVER.post("/svm", (req, res, next) => {
//     console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
//     NetworkResult.send(Loader.set(`bar@${req.body["id"]}`, req.body["p"], "db", "test@test"), res);
// });

SERVER.listen(PORT, HOST, () => {
    console.log(`server running on ${HOST}:${PORT}`);
});
