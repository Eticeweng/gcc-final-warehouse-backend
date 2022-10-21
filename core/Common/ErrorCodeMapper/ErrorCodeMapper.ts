import FS from "./mappers/FS";
import Loader from "./mappers/Loader";

export class ErrorCodeMapper{
    private static MAPPER_MAP = {
        "FS": FS,
        "LOADER": Loader
    }

    public static getCode(complexType: string, errorCode: string): number {
        let code = this.MAPPER_MAP[complexType][errorCode];
        if (code == undefined) {
            console.warn(`error code ${complexType}::${errorCode} is not defined`);
            // throw Error();
            return 500;
        }
        return code;
    }
}
