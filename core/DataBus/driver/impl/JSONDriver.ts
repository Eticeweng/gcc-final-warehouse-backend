import {IDriver} from "../IDriver";
import fs from "fs";
import {IData} from "../../IData";
import {Factory} from "../../Factory";

export class JSONDriver<T> implements IDriver<T> {
    deSerialize(endPoint: string): T {
        try {
            let raw = JSON.parse(fs.readFileSync(endPoint + ".json", {encoding: "utf-8"}));
            let out = {};
            Object.entries(raw).forEach((r: [string, any]) => {
                out[r[0]] = r[1];
            });
            return out as T;
        } catch (e) {
            throw e;
        }
    }

    serialize(object: T, endPoint: string): boolean {
        try {
            let data = {};
            [...Object.entries(object)].forEach(r => data[r[0]] = r[1]);
            fs.writeFileSync(`${endPoint}.json`, JSON.stringify(data));
            return true;
        } catch (e) {
            throw e;
        }
    }

    tpDeserialize<A>(raw: any): A {
        return undefined;
    }

    tpSerialize(object: any): boolean {
        return false;
    }

}
