import {Loader} from "../core/UniversalPropertyLoader/Loader";
import {DBWorker} from "../core/UniversalPropertyLoader/wokers/impl/DBWorker";
import {Complex} from "../core/Complex/Complex";
import {AccessControl} from "../permission/AccessControl";
import {ErrorComplex} from "../core/Complex/impl/ErrorComplex";
import {MemoryVirtualTableWorker} from "../core/UniversalPropertyLoader/wokers/impl/MemoryVirtualTableWorker";
import {UserInstance} from "./instance/UserInstance";
import {ResultComplex} from "../core/Complex/impl/ResultComplex";
import {NavigationService} from "./NavigationService";
import {AuthedUser} from "./instance/AuthedUser";
import {authenticator} from "otplib";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

import jwtsecret from "../stores/jwtsecret.json";

export class AuthService {
    public static keys = {
        UserDB: Loader.buildKey(["db", "user"]),
        UserInstanceTable: Loader.buildKey(["mvt", "userinst"]),
        UserAuthed: Loader.buildKey(["mvt", "userauthed"])
    }

    static readonly TYPE: string = "AS";

    static {
        try {
            Loader.assignWorker(new DBWorker("test", "user"), this.keys.UserDB);
            Loader.assignWorker(new MemoryVirtualTableWorker("userinst", {
                instance: UserInstance
            }), this.keys.UserInstanceTable);
            Loader.assignWorker(new MemoryVirtualTableWorker("userauthed", {
                authedUser: AuthedUser
            }), this.keys.UserAuthed);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    static getAuthMethod(userBeacon: string): Complex<string[]> {
        try {
            if (AccessControl.checkUserBeaconExists(userBeacon)) {
                // todo: one more field to indicate the auth method in the db
                return new ResultComplex(this.TYPE,
                    Loader.get<[string]>(["auth_method"], userBeacon, this.keys.UserDB)[0]
                        .split(","));
            }
            return new ErrorComplex(this.TYPE, "USER_NEXST", "");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static async createAuth(userBeacon: string, authToken: string, name: string, permission: number, authMethod: string[]): Promise<Complex<[string, string]>> {
        try {
            let secret = authenticator.generateSecret();
            Loader.put<[string, string, string, number, string]>(["token", "_2fakey", "name", "permission", "authMethod"],
                userBeacon, [authToken, secret, name, permission, authMethod.join(",")], this.keys.UserDB);
            let _2faURL = authenticator.keyuri(userBeacon, "Project Warehouse", secret);
            let qrCodeURL = "";
            await qrcode.toDataURL(_2faURL).then(url => {
                qrCodeURL = url;
            });
            return new ResultComplex(this.TYPE, [secret, qrCodeURL]);
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static auth(userBeacon: string, authToken: string): Complex<string> {
        try {
            if (AccessControl.checkAccountAuthPrivilege(userBeacon, authToken)) {
                if (!Loader.exists("", userBeacon, this.keys.UserAuthed)) {
                    Loader.put<[AuthedUser]>(["authedUser"], userBeacon,
                        [new AuthedUser()], this.keys.UserAuthed);
                }
                return new ResultComplex(this.TYPE, jwt.sign({
                    userBeacon: userBeacon,
                    userInstance: this.assignInstance(userBeacon).data
                }, jwtsecret["secret"]));
            }
            return new ErrorComplex(this.TYPE, "AUTH_FAIL", "");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static deAuth(userBeacon: string, instanceID: string): Complex<boolean> {
        try {
            if (AccessControl.checkUserInstanceOwning(userBeacon, instanceID)) {
                let resignResult = this.resignInstance(userBeacon, instanceID);
                if (resignResult.data) {
                    let authedUser = Loader.get<[AuthedUser]>(["authedUser"],
                        userBeacon, this.keys.UserAuthed)[0];
                    authedUser.userInstances.delete(instanceID);
                    if (authedUser.userInstances.size == 0) {
                        Loader.delete("", userBeacon, this.keys.UserAuthed);
                    }
                }
                return resignResult;
            }
            return new ErrorComplex(this.TYPE, "NOT_OWN", "");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static deAuthAll(userBeacon: string, instanceID: string): Complex<boolean> {
        try {
            if (AccessControl.checkUserInstanceOwning(userBeacon, instanceID)) {
                let deAuthResult = true;
                Loader.get<[AuthedUser]>(["authedUser"], userBeacon, this.keys.UserAuthed)[0]
                    .userInstances.forEach(instance => {
                    deAuthResult = this.resignInstance(userBeacon, instance).data;
                });
                return new ResultComplex(this.TYPE, deAuthResult);
            }
            return new ErrorComplex(this.TYPE, "NOT_OWN", "");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static assignInstance(userBeacon: string): Complex<string> {
        try {
            let instance = new UserInstance(userBeacon);
            Loader.get<[AuthedUser]>(["authedUser"], userBeacon, this.keys.UserAuthed)[0]
                .userInstances.add(instance.userInstanceID);
            Loader.put<[UserInstance]>(["instance"], instance.userInstanceID,
                [instance], this.keys.UserInstanceTable);
            return new ResultComplex(this.TYPE, instance.userInstanceID);
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static resignInstance(userBeacon: string, instanceID: string): Complex<boolean> {
        try {
            let instance = Loader.get<[UserInstance]>([""], instanceID, this.keys.UserInstanceTable)[0];
            // cleanup
            let cleanupResult = true;
            instance.browsingInstances.forEach(instance =>
                cleanupResult = Loader.delete("", instance, NavigationService.keys.NavigationInstanceTable)
            );
            // cleanup
            return cleanupResult ?
                new ResultComplex(this.TYPE,
                    Loader.delete("", instanceID, this.keys.UserInstanceTable)
                ) :
                new ErrorComplex(this.TYPE, "USER_INST_REMOVE_FAIL", `request user instance ${instanceID} not exists or fail to clean up`);
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }
}
