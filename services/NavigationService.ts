import {Navigation} from "./instance/Navigation";
import {Loader} from "../core/UniversalPropertyLoader/Loader";
import {MemoryVirtualTableWorker} from "../core/UniversalPropertyLoader/wokers/impl/MemoryVirtualTableWorker";
import {Complex} from "../core/Complex/Complex";
import {UUID} from "../core/UUID";
import {ResultComplex} from "../core/Complex/impl/ResultComplex";
import {ErrorComplex} from "../core/Complex/impl/ErrorComplex";
import {DBWorker} from "../core/UniversalPropertyLoader/wokers/impl/DBWorker";
import {AccessControl} from "../permission/AccessControl";
import {UserInstance} from "./instance/UserInstance";
import {AuthService} from "./AuthService";

export class NavigationService {
    public static keys = {
        NavigationInstanceTable: Loader.buildKey(["mvt", "navser"]),
        UserFS: Loader.buildKey(["db", "userfs"])
    }
    static readonly TYPE = "FSNAV";

    static {
        try {
            Loader.assignWorker(new MemoryVirtualTableWorker("navser", {
                navigation: Navigation
            }), this.keys.NavigationInstanceTable);
            Loader.assignWorker(new DBWorker("test", "userfs"), this.keys.UserFS);
        } catch (e) {
            throw {
                type: this.TYPE,
                code: e.code,
                message: e.message
            }
        }
    }

    static assignNavigation(userBeacon: string, userInstanceID: string): Complex<[string, [string, any[]][]]> {
        try {
            if (AccessControl.checkUserInstanceOwning(userBeacon, userInstanceID)) {
                let uuid = UUID.generate();
                let navigationInstance = new Navigation(userInstanceID,
                    Loader.get<[string]>(["base_dir_path"], userBeacon, this.keys.UserFS)[0]
                );
                let dirList = navigationInstance.ready();
                Loader.put<[Navigation]>(["navigation"], uuid, [navigationInstance], this.keys.NavigationInstanceTable);
                Loader.get<[UserInstance]>(["instance"], userInstanceID,
                    AuthService.keys.UserInstanceTable)[0]?.browsingInstances.add(uuid);
                return new ResultComplex(this.TYPE, [uuid, dirList]);
            }
            return new ErrorComplex(AccessControl.TYPE, "UINST_NOT_OWN", "user instance is not belong to you");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static removeNavigation(userBeacon: string, userInstanceID: string, instanceID: string): Complex<boolean> {
        try {
            if (AccessControl.checkBrowsingInstancePrivilege(userBeacon, userInstanceID, instanceID)) {
                if (Loader.delete("", instanceID, this.keys.NavigationInstanceTable)) {
                    Loader.get<[UserInstance]>(["instance"], userInstanceID,
                        AuthService.keys.UserInstanceTable)[0]?.browsingInstances.delete(instanceID);
                    return new ResultComplex(this.TYPE, true);
                }
                return new ResultComplex(this.TYPE, false);
            }
            return new ErrorComplex(AccessControl.TYPE, "PERMI_DENY", "permission denied");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static forward(userBeacon: string, userInstanceID: string, instanceID: string, where: string): Complex<[string, any[]][]> {
        try {
            if (AccessControl.checkBrowsingInstancePrivilege(userBeacon, userInstanceID, instanceID)) {
                let navigationInstance = Loader.get<[Navigation]>(["navigation"], instanceID, this.keys.NavigationInstanceTable)[0];
                return navigationInstance == null ?
                    new ErrorComplex(this.TYPE, "FSNAV_INST_NEXTS", `request ${instanceID} instance not exists`) :
                    new ResultComplex<[string, any[]][]>(this.TYPE, navigationInstance.forward(where));
            }
            return new ErrorComplex(AccessControl.TYPE, "PERMI_DENY", "permission denied");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static backward(userBeacon: string, userInstanceID: string, instanceID: string): Complex<[string, any[]][]> {
        try {
            if (AccessControl.checkBrowsingInstancePrivilege(userBeacon, userInstanceID, instanceID)) {
                let navigationInstance = Loader.get<[Navigation]>(["navigation"], instanceID, this.keys.NavigationInstanceTable)[0];
                return navigationInstance == null ?
                    new ErrorComplex(this.TYPE, "FSNAV_INST_NEXTS", `request ${instanceID} instance not exists`) :
                    new ResultComplex<[string, any[]][]>(this.TYPE, navigationInstance.backward());
            }
            return new ErrorComplex(AccessControl.TYPE, "PERMI_DENY", "permission denied");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static locate(userBeacon: string, userInstanceID: string, instanceID: string, fullPath: string): Complex<[string, any[]][]> {
        try {
            if (AccessControl.checkBrowsingInstancePrivilege(userBeacon, userInstanceID, instanceID)) {
                let navigationInstance = Loader.get<[Navigation]>(["navigation"], instanceID, this.keys.NavigationInstanceTable)[0];
                return navigationInstance == null ?
                    new ErrorComplex(this.TYPE, "FSNAV_INST_NEXTS", `request ${instanceID} instance not exists`) :
                    new ResultComplex<[string, any[]][]>(this.TYPE, navigationInstance.locate(fullPath));
            }
            return new ErrorComplex(AccessControl.TYPE, "PERMI_DENY", "permission denied");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }

    static listDirectory(userBeacon: string, userInstanceID: string, instanceID: string): Complex<[string, any[]][]> {
        try {
            if (AccessControl.checkBrowsingInstancePrivilege(userBeacon, userInstanceID, instanceID)) {
                let navigationInstance = Loader.get<[Navigation]>(["navigation"], instanceID, this.keys.NavigationInstanceTable)[0];
                return navigationInstance == null ?
                    new ErrorComplex(this.TYPE, "FSNAV_INST_NEXTS", `request ${instanceID} instance not exists`) :
                    new ResultComplex<[string, any[]][]>(this.TYPE, navigationInstance.listDirectory());
            }
            return new ErrorComplex(AccessControl.TYPE, "PERMI_DENY", "permission denied");
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
    }
}
