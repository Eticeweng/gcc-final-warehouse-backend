export class AuthedUser {
    private _userInstances: Set<string> = new Set<string>;

    get userInstances(): Set<string> {
        return this._userInstances;
    }
}
