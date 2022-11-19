import {NavigationService} from "./services/NavigationService";
import {Loader} from "./core/UniversalPropertyLoader/Loader";
import {YAMLWorker} from "./core/UniversalPropertyLoader/wokers/impl/YAMLWorker";
import express from "express";
import {Navigation} from "./services/instance/Navigation";
import {NetworkResult} from "./core/NetworkResult";
import {DBWorker} from "./core/UniversalPropertyLoader/wokers/impl/DBWorker";
import {AuthService} from "./services/AuthService";
import {ResultComplex} from "./core/Complex/impl/ResultComplex";
import {InterfaceSchema} from "./InterfaceSchema";
import {ErrorComplex} from "./core/Complex/impl/ErrorComplex";
import {AuthedUser} from "./services/instance/AuthedUser";
import jwt from "jsonwebtoken";

import jwtsecret from "./stores/jwtsecret.json";

Loader.assignWorker(new YAMLWorker("server"), "static", "server");

const SERVER = express();
const PORT = Loader.get<[number]>(["Port"], null, "static", "server")[0];
const HOST = Loader.get<[string]>(["Hostname"], null, "static", "server")[0];
SERVER.use(express.json());

let unAuthedURLWhitelist = new Set<string>(["/auth", "/create", "/authMethod"]);
let secret = jwtsecret["secret"];
SERVER.use((req, res, next) => {
    res.setHeader("Cache-Control", "must-revalidate");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    console.log(`${req.ip} ${req.method} ${req.url} ${JSON.stringify([req.body, req.query, req.params])}`);
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
});

Loader.assignWorker(new YAMLWorker("fsnav"), "static", "fsnav");
Loader.assignWorker(new DBWorker("test", "user"), "db", "user");

////
// todo: transfer userBeacon, userInstance via JWT
////

SERVER.post("/create", (req, res, next) => {
    // NetworkResult.send(AuthService.createAuth(req.body[""]))
});

SERVER.get("/authMethod", (req, res, next) => {
    // use query here
    NetworkResult.send(AuthService.getAuthMethod(req.params["userBeacon"]), res);
});

SERVER.post("/auth", (req, res, next) => {
    NetworkResult.send(AuthService.auth(req.body["userBeacon"], req.body["userToken"]), res);
});

SERVER.post("/deauth", async (req, res, next) => {
    NetworkResult.send(AuthService.deAuth(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"]), res);
});

SERVER.post("/deauthAll", (req, res, next) => {
    NetworkResult.send(AuthService.deAuthAll(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"]), res);
});

SERVER.post("/assign", (req, res, next) => {
    NetworkResult.send(
        NavigationService.assignNavigation(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"]), res
    );
});

SERVER.post("/remove", (req, res, next) => {
    NetworkResult.send(
        NavigationService.removeNavigation(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
            req.body["instance"]), res
    );
});

SERVER.post("/go", (req, res, next) => {
    NetworkResult.send(
        NavigationService.forward(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
            req.body["instance"], req.body["where"]), res
    );
});

SERVER.post("/back", (req, res, next) => {
    NetworkResult.send(
        NavigationService.backward(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
            req.body["instance"]), res
    );
});

SERVER.post("/tp", (req, res, next) => {
    NetworkResult.send(
        NavigationService.locate(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
            req.body["instance"], req.body["fullPath"]), res
    );
});

SERVER.post("/debug/brwinst", (req, res, next) => {
   NetworkResult.send(new ResultComplex<{}>("DEBUG", Loader.operate<{}, {}>((instance) => {
       return instance;
   }, NavigationService.keys.NavigationInstanceTable)), res);
});

SERVER.listen(PORT, HOST, () => {
    console.log(`server running on ${PORT}:${HOST}`);
});
