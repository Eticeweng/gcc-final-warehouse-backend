import {IWorker} from "../IWorker";
import Database, {prototype} from "better-sqlite3";
import {Loader} from "../../Loader";
import {inflate} from "zlib";

// import Database from "better-sqlite3";

export class DBWorker implements IWorker{
    readonly PHYSICAL_LOCATION: string;
    instance: Database.Database;
    private readonly TYPE = "DB";
    private readonly TABLE_NAME;

    constructor(endPoint: string, tableName: string) {
        let location = Loader.DB_LOCATION + endPoint + ".db";
        try {
            this.instance = new Database(location);
            this.instance.pragma("foreign_keys = ON");
        } catch (e) {
            throw e;
        }
        this.PHYSICAL_LOCATION = location;
        this.TABLE_NAME = tableName;
    }

    get<T extends any[]>(propertyKey: string[], propertyID: string): [...T] {
        let params = {
            _propertyName: propertyKey.join(","),
            _tableName: this.TABLE_NAME,
            _propertyID: propertyID
        };
        return this.instance.prepare(
            `select ${params._propertyName} from ${this.TABLE_NAME} where propertyID = @_propertyID`
        ).raw().get(params) as [...T];
    }

    set<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        let params = {
            _tableName: this.TABLE_NAME,
            _propertyName: `(${propertyKeys.join(",")})`,
            _property: `(${properties.map(v => `'${v}'`).join(",")})`,
            _propertyID: propertyID // better-sqlite3 replace and fill the " automatically
        };
        try {
            return this.instance.prepare(
                `update ${this.TABLE_NAME} set ${params._propertyName} = ${params._property} where propertyID = @_propertyID`
            ).run(params).changes != 0;
        } catch (e) {
            throw e;
        }
    }

    put<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean {
        let params = {
            _tableName: this.TABLE_NAME,
            _propertyName: `${propertyKeys.join(",")}`,
            _property: `${properties.map(v => `'${v}'`).join(",")}`,
            _propertyID: propertyID
        };
        try {
            return this.instance.prepare(
                `insert into ${this.TABLE_NAME} (propertyID, ${params._propertyName}) values (@_propertyID, ${params._property})`
            ).run(params).changes != 0;
        } catch (e) {
            throw e;
        }
    }

    delete(propertyKey: string, propertyID?: string): boolean {
        if (propertyKey === "*") {
            return this.instance.prepare(
                `delete from ${this.TABLE_NAME} where propertyID = @_propertyID`
            ).run({
                _propertyID: propertyID
            }).changes == 1;
        }
        return this.instance.prepare(
            `update ${this.TABLE_NAME} set ${propertyKey} = null where propertyID = @_propertyID`
        ).run({
            _propertyID: propertyID
        }).changes == 1;
    }

    // why someone need to sniff a field is null or not??????
    exists(propertyKey: string, propertyID?: string): boolean {
        if (propertyKey === "*") {
            return this.instance.prepare(
                `select count(*) from ${this.TABLE_NAME} where propertyID = @_propertyID`
                    .replace("@_tableName", this.TABLE_NAME)
            ).raw().get({
                _propertyID: propertyID
            }) == 1;
        }
        return this.instance.prepare(
            `select ${propertyKey} from ${this.TABLE_NAME} where propertyID = @_propertyID`
        ).raw().get({
            _propertyID: propertyID
        }) != null;
    }

    operate<T, R>(operator: (instance: T | any) => any): R {
        return operator(this.instance) as R;
    }

    flush(): boolean {
        this.instance.close();
        return true;
    }

}
