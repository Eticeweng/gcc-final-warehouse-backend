import FS from "./mapper/FS";

export class ErrorCodeMapper{
    private static MAPPER_MAP = {
        "FS": FS
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
