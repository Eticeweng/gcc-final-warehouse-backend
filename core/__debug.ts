import express from "express";
import {Navigator} from "./FIleSystemAnalyzeTool/Navigator";
import {NetworkResult} from "./Common/NetworkResult";
import {Loader} from "./UniversalPropertyLoader/Loader";

// init
Loader.createWorker("static", "server"); // static_server
Loader.createWorker("static", "test"); // static_test
console.log(Loader.get<string>("SMDG/B/AR", "static", "test").data);

Loader.createWorker("db", "test@test"); // db_test@test
console.log(Loader.set("foo@vd1", "hello", "db", "test@test"));
console.log(Loader.get<string>("foo@vd1", "db", "test@test").data);

const SERVER = express();
const PORT = Loader.get<number>("Port", "static_server").data;
const HOST = Loader.get<string>("Hostname", "static", "server").data;

SERVER.use(express.json());

const BASE_DIR = "E:";

let navigator = new Navigator();

SERVER.get("/ready", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.query)}`);
    NetworkResult.send(navigator.locate(BASE_DIR), res);
});

SERVER.post("/go", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    NetworkResult.send(navigator.forward(req.body["where"]), res);
});

SERVER.post("/back", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    NetworkResult.send(navigator.backward(), res);
});

SERVER.post("/to", (req, res, next) => {
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    NetworkResult.send(navigator.locate(req.body["fullPath"]), res);
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
