import express from "express";
import {NetworkResult} from "../core/NetworkResult";
import {NavigationService} from "../services/NavigationService";

export class NavigationController {
    static controller: express.Router = express.Router();

    static {
        this.controller.get("/assign", (req, res, next) => {
            NetworkResult.send(
                NavigationService.assignNavigation(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"]), res
            );
        });

        this.controller.post("/remove", (req, res, next) => {
            NetworkResult.send(
                NavigationService.removeNavigation(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
                    req.body["instance"]), res
            );
        });

        this.controller.post("/go", (req, res, next) => {
            NetworkResult.send(
                NavigationService.forward(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
                    req.body["instance"], req.body["where"]), res
            );
        });

        this.controller.post("/back", (req, res, next) => {
            NetworkResult.send(
                NavigationService.backward(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
                    req.body["instance"]), res
            );
        });

        this.controller.post("/tp", (req, res, next) => {
            NetworkResult.send(
                NavigationService.locate(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
                    req.body["instance"], req.body["fullPath"]), res
            );
        });

        this.controller.post("/list", (req, res, next) => {
            NetworkResult.send(
                NavigationService.listDirectory(res.locals.authInfo["userBeacon"], res.locals.authInfo["userInstance"],
                    req.body["instance"]), res
            );
        })
    }
}
