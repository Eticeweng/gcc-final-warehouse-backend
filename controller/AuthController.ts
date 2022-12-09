import {NetworkResult} from "../core/NetworkResult";
import {AuthService} from "../services/AuthService";
import express from "express";

export class AuthController {
    static controller: express.Router = express.Router();

    static {
        this.controller.post("/create", async (req, res, next) => {
            NetworkResult.send(
                await AuthService.createAuth(req.body["beacon"], req.body["token"], req.body["name"], req.body["baseDir"], req.body["permission"],
                    req.body["authMethod"]), res
            );
        });

        this.controller.get("/authMethod", (req, res, next) => {
            // use query here
            NetworkResult.send(AuthService.getAuthMethod(req.query.userBeacon as string), res);
        });

        this.controller.post("/auth", (req, res, next) => {
            NetworkResult.send(AuthService.auth(req.body["userBeacon"], req.body["authInfo"]), res);
        });

        this.controller.post("/deauth", async (req, res, next) => {
            NetworkResult.send(AuthService.deAuth(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"]), res);
        });

        this.controller.post("/deauthAll", (req, res, next) => {
            NetworkResult.send(AuthService.deAuthAll(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"]), res);
        });
    }
}
