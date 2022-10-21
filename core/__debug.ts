import express from "express";
import {Navigator} from "./FIleSystemAnalyzeTool/Navigator";
import {NetworkResult} from "./Common/NetworkResult";
import {Loader} from "./UniversalPropertyLoader/Loader";
import Database from "better-sqlite3";

// init
Loader.createWorker("static", "server"); // static_server
Loader.createWorker("static", "test"); // static_test
// console.log(Loader.get<string>("SMDG/B/AR", "static", "test").data);
//
// Loader.createWorker("db", "test@test"); // db_test@test
// console.log(Loader.set("foo@vd1", "hello", "db", "test@test").data);
// console.log(Loader.get<string>("foo@vd1", "db", "test@test").data);
// console.log(Database.prototype.prepare);

// make sure return the result

// Loader.createWorker("db", "nasq@test");
// console.log(Loader.set("foo@xd1", "vhello", "db", "nasq@test").data);
// console.log(Loader.get("foo@xd1", "db", "nasq@test").data);
// console.log(Loader.get("foo@xd1", "db", "test@test").data);
// console.log("operator:", Loader.operate<Database.Database, number>(instance => {
//     // console.log(instance.prepare("insert into nasq values ('xd2a', 'vale')").run().changes);
//     return instance.prepare("select * from nasq").all();
// }, "db", "nasq@test").data);

const SERVER = express();
const PORT = Loader.get<number>("Port", "static_server").data;
const HOST = Loader.get<string>("Hostname", "static", "server").data;

SERVER.use(express.json());
SERVER.use((req, res, next) => {
    res.setHeader("Cache-Control", "must-revalidate");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

const BASE_DIR = "E:";

Loader.createWorker("static", "fsnav");
let navigator = new Navigator();

SERVER.get("/ready", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    NetworkResult.send(navigator.locate(BASE_DIR), res);
});

SERVER.post("/go", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    NetworkResult.send(navigator.forward(req.body["where"]), res);
});

SERVER.get("/back", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    NetworkResult.send(navigator.backward(), res);
});

SERVER.post("/to", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    NetworkResult.send(navigator.locate(req.body["fullPath"]), res);
});

SERVER.get("/pwd", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    NetworkResult.send(navigator.currentPath(), res);
});

SERVER.get("/list", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    NetworkResult.send(navigator.list(), res);
});

SERVER.get("/gvm", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    NetworkResult.send(Loader.get(`bar@${req.query["id"]}`, "db", "test@SVN"), res);
});

SERVER.post("/svm", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    NetworkResult.send(Loader.set(`bar@${req.body["id"]}`, req.body["p"], "db", "test@test"), res);
});

SERVER.listen(PORT, HOST, () => {
    console.log(`server running on ${HOST}:${PORT}`);
});
