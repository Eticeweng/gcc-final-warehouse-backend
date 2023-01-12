import {Loader} from "../core/UniversalPropertyLoader/Loader";
import {MemoryVirtualTableWorker} from "../core/UniversalPropertyLoader/wokers/impl/MemoryVirtualTableWorker";
import {UserInstance} from "../services/instance/UserInstance";
import {NavigationService} from "../services/NavigationService";
import {Navigation} from "../services/instance/Navigation";
import * as crypto from "crypto";
import {AuthService} from "../services/AuthService";
import {AuthedUser} from "../services/instance/AuthedUser";

export class AccessControl {
    static readonly TYPE = "AC";

    static checkUserInstanceOwning(userBeacon: string, instanceID: string): boolean {
        try {
            return Loader.get<[AuthedUser]>(["authedUser"], userBeacon,
                AuthService.keys.UserAuthed)[0]?.userInstances.has(instanceID);
        } catch (e) {
            throw {
                type: e.type || this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    static checkUserBeaconExists(userBeacon: string): boolean {
        try {
            return Loader.exists("*", userBeacon, AuthService.keys.UserDB);
        } catch (e) {
            throw {
                type: e.type || this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    static checkAccountPermissionLevel(userBeacon: string) {}

    static checkBrowsingInstancePrivilege(userBeacon: string, userInstanceID: string, instanceID: string): boolean {
        try {
            let permission = Loader.get<[number]>(["permission"], userBeacon, "db", "user")[0];
            if (permission == null) {
                return false; // invalid user
            }
            if (permission >= 3) {
                return true; // owner(admin)
            }
            let userInstanceValidity = this.checkUserInstanceOwning(userBeacon, userInstanceID);
            let instanceIDValidity =
                Loader.get<[Navigation]>(["navigation"], instanceID,
                    NavigationService.keys.NavigationInstanceTable)[0]?.userInstanceID === userInstanceID;
            return userInstanceValidity && instanceIDValidity;
        } catch (e) {
            throw {
                type: e.type || this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    static checkBrowsingActionInvalidity
}
