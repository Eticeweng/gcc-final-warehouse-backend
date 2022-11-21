import fs from "fs";
import path from "path";

export class ErrorCodeMapper{
    private static MAPPER_MAP = {};

    public static getCode(complexType: string, errorCode: string): number {
        try {
            if (!this.MAPPER_MAP[complexType]) {
                this.MAPPER_MAP[complexType] = JSON.parse(
                    fs.readFileSync(path.resolve(
                        __dirname,
                        `../../stores/mappers/${complexType}.json`),
                        {encoding: "utf-8"})
                )
            }
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
