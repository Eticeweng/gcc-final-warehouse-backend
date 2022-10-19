
export interface IWorker {
    instance: any;
    readonly PHYSICAL_LOCATION: string;
    get<T = any>(propertyKey: string | Function): T;
    set(propertyKey: string, property: any): boolean;
    flush(): boolean;
}
