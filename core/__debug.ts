import express from "express";
import {Navigator} from "./FIleSystemAnalyzeTool/Navigator";
import {NetworkResult} from "./Common/NetworkResult";

const SERVER = express();
const PORT = 1389;

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

SERVER.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
