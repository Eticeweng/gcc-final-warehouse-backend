
export interface IWorker {
    instance: any;
    readonly PHYSICAL_LOCATION: string;
    get<T = any>(propertyKey: string | ((instance: any) => any)): T;
    set(propertyKey: string, property: any): boolean;
    operate<T, R>(operator: ((instance: T | any) => any)): R;
    flush(): boolean;
}
