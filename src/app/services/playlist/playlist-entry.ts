export class PlaylistEntry {
    constructor(private _referencePath: string, private _decodedPath: string) {}

    public get referencePath(): string {
        return this._referencePath;
    }

    public get decodedPath(): string {
        return this._decodedPath;
    }
}
