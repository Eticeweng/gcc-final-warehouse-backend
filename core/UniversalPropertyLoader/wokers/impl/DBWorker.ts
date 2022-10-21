import {IWorker} from "../IWorker";
import Database, {prototype} from "better-sqlite3";
import {Loader} from "../../Loader";

// import Database from "better-sqlite3";

export class DBWorker implements IWorker{
    readonly PHYSICAL_LOCATION: string;
    instance: Database.Database;
    private readonly TYPE = "DB";
    private readonly TABLE_NAME;

    constructor(endPoint: string) { // <tableName>@<dbFileName> no .db
        let complex = endPoint.split("@");
        if (complex.length != 2) {
            throw SyntaxError("missing arg(s), required 2");
        }
        let table = complex[0];
        let location = Loader.DB_LOCATION + complex[1] + ".db";
        try {
            this.instance = new Database(location);
        } catch (e) {
            throw e;
        }
        this.PHYSICAL_LOCATION = location;
        this.TABLE_NAME = table;
    }

    // put a sql query here
    get<T = any>(propertyKey: string): T; // only return value of pointed key
    get<T = any>(propertyKey: ((instance: Database.Database) => T)): T; // execute the function bound to this db instance
    get<T = any>(propertyKey: string | ((instance: Database.Database) => T)): T {
        if (typeof propertyKey === "function") {
            let result = null;
            try {
                result = propertyKey(this.instance);
            } catch (e) {
                throw e;
            }
            return result as T;
        } else if (typeof propertyKey === "string") {
            let complex = propertyKey.split("@");
            if (complex.length != 2) {
                throw SyntaxError("missing arg(s), required 2");
            }
            let params = {
                _propertyName: complex[0],
                _tableName: this.TABLE_NAME,
                _propertyID: complex[1]
            };

            return this.instance.prepare( // model: <propertyName>@<propertyID>
                "select @_propertyName from @_tableName where propertyID = @_propertyID"
                    .replace("@_tableName", params._tableName)
                    .replace("@_propertyName", params._propertyName)
            ).pluck().get(params) as T;
        }
        throw TypeError("failed to match key type(Function or String)");
    }

    set(propertyKey: string, property: any): boolean {
        let complex = propertyKey.split("@");
        if (complex.length != 2) {
            throw SyntaxError("missing arg(s), required 2");
        }
        let params = { //
            _tableName: this.TABLE_NAME,
            _propertyName: complex[0],
            _property: property,
            _propertyID: complex[1]
        };
        let exists = this.instance.prepare(
            "select count(*) from @_tableName where propertyID = @_propertyID"
                .replace("@_tableName", params._tableName)
        ).raw().get(params) == 1;
        if (exists) {
            return this.instance.prepare(
                "update @_tableName set @_propertyName = @_property where propertyID = @_propertyID"
                    .replace("@_tableName", params._tableName)
                    .replace("@_propertyName", params._propertyName)
            ).run(params).changes != 0;
        }
        return this.instance.prepare(
            "insert into @_tableName (propertyID, @_propertyName) values (@_propertyID, @_property)"
                .replace("@_tableName", params._tableName)
                .replace("@_propertyName", params._propertyName)
        ).run(params).changes != 0;
    }

    operate<T, R>(operator: (instance: T | any) => any): R {
        return operator(this.instance) as R;
    }



    flush(): boolean {
        return true;
    }

}
