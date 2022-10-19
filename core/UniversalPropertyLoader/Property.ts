import {Source} from "./Source";

export class Property<T> {
    protected readonly SOURCE_TYPE: string;
    protected readonly SOURCE_LOCATION: string;
    protected property: T;
    // protected refCount: number; // depending

    constructor(SOURCE_TYPE: string, SOURCE_LOCATION: string, property: T) {
        this.SOURCE_TYPE = SOURCE_TYPE;
        this.SOURCE_LOCATION = SOURCE_LOCATION;
        this.property = property;
    }
}
