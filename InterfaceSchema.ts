import {Request} from "express";
import schemas from "./SchemaDict";

export class InterfaceSchema {
    static check(url: string, req: Request): string[] {
        let schema = schemas[url];
        if (!schema) {
            return [];
        }
        let object: [string, string[]][] = Object.entries(schema);
        let missingParams = [];
        for (let slice of object) {
            for (let param of slice[1]) {
                if (!req[slice[0]][param]) {
                    missingParams.push(`${slice[0]}:${param}`);
                }
            }
        }
        return missingParams;
    }
}
