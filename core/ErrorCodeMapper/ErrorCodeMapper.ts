import FS from "../../stores/mappers/FS.json";
import Loader from "../../stores/mappers/Loader.json";
import FSNAV from "../../stores/mappers/FSNAV.json";
import AS from "../../stores/mappers/AS.json";
import AC from "../../stores/mappers/AC.json";
import MISC from "../../stores/mappers/MISC.json";

export class ErrorCodeMapper{
    private static MAPPER_MAP = {
        "FS": FS,
        "LOADER": Loader,
        "FSNAV": FSNAV,
        "AS": AS,
        "AC": AC,
        "MISC": MISC
    }

    public static getCode(complexType: string, errorCode: string): number {
        try {
            let code = this.MAPPER_MAP[complexType][errorCode];
            if (code == undefined) {
                throw null;
            }
            return code;
        } catch (e) {
            console.warn(`error code ${complexType}::${errorCode} is not defined`);
            return 500;
        }
    }
}
