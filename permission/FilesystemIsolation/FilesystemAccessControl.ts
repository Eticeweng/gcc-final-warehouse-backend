import {Loader} from "../../core/UniversalPropertyLoader/Loader";
import {DBWorker} from "../../core/UniversalPropertyLoader/wokers/impl/DBWorker";
import {Navigation} from "../../services/instance/Navigation";
import {NavigationService} from "../../services/NavigationService";

export class FilesystemAccessControl {
    private readonly TYPE = "FSAC";

    // todo: should be enumeration, 1 forward, -1 backward
    static checkAccessDepth(beacon: string, action: number): boolean {
        try {
            let navigation = Loader.get<[Navigation]>(["navigation"], beacon, NavigationService.keys.NavigationInstanceTable)[0];
            // let isolation = Loader.get<>
        } catch (e) {

        }
        return false;
    }
}
