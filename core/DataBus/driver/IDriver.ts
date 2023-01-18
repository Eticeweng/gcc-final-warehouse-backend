export interface IDriver<T> {
    // if using a third party data provider
    tpSerialize(object: any): boolean;
    tpDeserialize<A>(raw: any): A;

    // if not
    serialize(object: T, endPoint: string): boolean;
    deSerialize(raw: any): T;
}
