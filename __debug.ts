import {NavigationService} from "./services/NavigationService";
import {Loader} from "./core/UniversalPropertyLoader/Loader";
import {YAMLWorker} from "./core/UniversalPropertyLoader/wokers/impl/YAMLWorker";
import history from "connect-history-api-fallback";
import express from "express";
import {NetworkResult} from "./core/NetworkResult";
import {DBWorker} from "./core/UniversalPropertyLoader/wokers/impl/DBWorker";
import {ResultComplex} from "./core/Complex/impl/ResultComplex";
import {InterfaceSchema} from "./InterfaceSchema";
import {ErrorComplex} from "./core/Complex/impl/ErrorComplex";
import jwt from "jsonwebtoken";

import jwtsecret from "./stores/jwtsecret.json";
import {AuthController} from "./controller/AuthController";
import {NavigationController} from "./controller/NavigationController";
import path from "path";

import {Duplex} from "stream";

Loader.assignWorker(new YAMLWorker("server"), "static", "server");

const SERVER = express();
const PORT = Loader.get<[number]>(["Port"], null, "static", "server")[0];
const HOST = Loader.get<[string]>(["Hostname"], null, "static", "server")[0];
SERVER.use(express.json());

// const UI = express();
// SERVER.use(express.static(path.resolve(__dirname, "../../frontend/ui/dist")));
SERVER.use(history({
    index: "/ui"
}));

const DATE_FORMAT = new Intl.DateTimeFormat("zh-cn", {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"})

let unAuthedURLWhitelist = new Set<string>(["/auth/auth", "/auth/create", "/auth/authMethod", "/shutdown", "/debug/brwinst"]);
let secret = jwtsecret["secret"];
SERVER.use((req, res, next) => {
    res.setHeader("Cache-Control", "must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (req.url.startsWith("/api")) { // counter url rewrite
        console.log(`[API_CALL] [${DATE_FORMAT.format(Date.now())}] ${req.ip} ${req.method} ${req.url} ${JSON.stringify([req.body, req.query, req.params])}`);
        req.url = req.url.slice(4);
        let indexOfDeli = req.url.indexOf("?");
        let url = req.url.slice(0, indexOfDeli == -1 ? req.url.length + 1 : indexOfDeli);
        if (!unAuthedURLWhitelist.has(url)) {
            try {
                res.locals.authInfo = jwt.verify(req.headers.authorization, secret);
                next();
            } catch (e) {
                NetworkResult.send(
                    new ErrorComplex("MISC", "NOT_AUTHED", "not authed, please auth first"),
                    res
                );
                return;
            }
        }
        let missingParams = InterfaceSchema.check(url, req);
        if (!missingParams.length) {
            next();
        } else {
            NetworkResult.send(
                new ErrorComplex("MISC", "ARG_MISSING", `required fields ${[...missingParams]} is missing`),
                res
            );
        }
        return;
    }
    if (req.url.startsWith("/ui")) {
        console.log(`[UI_CALL] [${DATE_FORMAT.format(Date.now())}] ${req.ip} ${req.method} ${req.url} ${JSON.stringify([req.body, req.query, req.params])}`);
        next();
        return;
    }
    console.log(`[OTHER] [${DATE_FORMAT.format(Date.now())}] ${req.ip} ${req.method} ${req.url} ${JSON.stringify([req.body, req.query, req.params])}`);
    next();
    return;
});

SERVER.all("/ui", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/ui/dist/index.html"));
});

Loader.assignWorker(new YAMLWorker("fsnav"), "static", "fsnav");
Loader.assignWorker(new DBWorker("test", "user"), "db", "user");

SERVER.use("/auth", AuthController.controller);
SERVER.use("/nav", NavigationController.controller);

SERVER.post("/debug/brwinst", (req, res, next) => {
   NetworkResult.send(new ResultComplex<{}>("DEBUG", Loader.operate<{}, {}>((instance) => {
       return instance;
   }, NavigationService.keys.NavigationInstanceTable)), res);
});

let running = SERVER.listen(PORT, HOST,() => {
    console.log(
        HOST === "0.0.0.0" ?
            `UI and core service are running on all the interface at ${PORT} on this device\n` :
            `UI and core service are running on http://${HOST}:${PORT}\n`,
        `please carry /api as prefix for API calls\n`,
        `please directly call route path for UIs`,
    );
});

SERVER.get("/shutdown", (req, res, next) => {
   running.close();
   NetworkResult.send(new ResultComplex("BYE", "BYE"), res);
});
