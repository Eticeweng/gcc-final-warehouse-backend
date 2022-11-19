import {Request} from "express";

export class InterfaceSchema {
    static schemas = {
        "/auth": {
            body: ["userBeacon", "userToken"]
        },
        "/remove": {
            body: ["instance"]
        },
        "/go": {
            body: ["instance", "where"]
        },
        "/back": {
            body: ["instance"]
        },
        "/tp": {
            body: ["instance", "fullPath"]
        }
    }
    static check(url: string, req: Request): string[] {
        let schema = this.schemas[url];
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
