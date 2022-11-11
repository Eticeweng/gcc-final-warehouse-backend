import {Navigation} from "./instance/Navigation";
import {Loader} from "../core/UniversalPropertyLoader/Loader";
import {MemoryVirtualTableWorker} from "../core/UniversalPropertyLoader/wokers/impl/MemoryVirtualTableWorker";
import {Complex} from "../core/Complex/Complex";
import {UUID} from "../core/UUID";
import {ResultComplex} from "../core/Complex/impl/ResultComplex";
import {ErrorComplex} from "../core/Complex/impl/ErrorComplex";
import {DBWorker} from "../core/UniversalPropertyLoader/wokers/impl/DBWorker";

export class NavigationService {
    static partitionKey = Loader.buildKey(["mvt", "navser"]);
    static readonly TYPE = "FSNAV";

    static {
        try {
            Loader.assignWorker(new MemoryVirtualTableWorker("navser", {
                navigation: Navigation
            }), this.partitionKey);
            Loader.assignWorker(new DBWorker("test", "userfs"), "db", "userfs");
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
            let uuid = UUID.generate();
            let navigationInstance = new Navigation(userInstanceID,
                Loader.get<[string]>(["base_dir_path"], userBeacon, "db", "userfs")[0]
            );
            let dirList = navigationInstance.ready();
            return new ResultComplex(this.TYPE, [uuid, dirList]);
        } catch (e) {
            return new ErrorComplex(e.type, e.code, e.message);
        }
        // let uuid = UUID.generate();
        // // todo: need base dir from db
        // let navigation = new Navigation(userInstanceID, "");
        // let list = navigation.ready();
        // let result = Loader.put<[Navigation]>(["navigation"], uuid,
        //     [navigation], this.partitionKey);
        // if (!result.isError) {
        //     return new ResultComplex("FSNAV", uuid);
        // }
        // return new ErrorComplex("FSNAV", result.errorCode, result.errorMessage);
    }

    static removeNavigation(instanceID: string, userInstanceID: string): boolean {
        try {
            let navigation = Loader.get<[Navigation]>(["navigation"], instanceID, this.partitionKey);
            return true;
        } catch (e) {
            
        }
        // // todo: or by owner(admin)
        // if (navigation.data[0].userInstanceID == userInstanceID) { // one more condition, see todo
        //     let result = Loader.delete("navigation", instanceID, this.partitionKey);
        //     if (!result.isError) {
        //         return new ResultComplex("FSNAV", true);
        //     }
        //     return new ErrorComplex("FSNAV", result.errorCode, result.errorMessage);
        // }
        // return new ErrorComplex("FSNAV", "FSNAV_NO_PERMI", "permission denied");
    }

    static initNavigation(instanceID: string, userInstanceID: string): any {

    }
}
