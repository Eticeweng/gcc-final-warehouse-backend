
export interface IWorker {
    instance: any;
    readonly PHYSICAL_LOCATION: string;

    // get value from field(s), apply id filter if they are exists
    get<T extends any[]>(propertyKey: string[], propertyID?: string): [...T];

    // set value for a field, apply id filter if they are exists
    set<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean;

    // put a row or an object into a virtual table on given fields and filter by id(if any)
    put<T extends any[]>(propertyKeys: string[], properties: T, propertyID?: string): boolean;
    delete(propertyKey: string, propertyID?: string): boolean;
    exists(propertyKey: string, propertyID?: string): boolean;
    operate<T, R>(operator: ((instance: T | any) => any)): R;
    flush(): boolean;
}
