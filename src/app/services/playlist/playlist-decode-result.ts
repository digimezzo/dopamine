import { PlaylistEntry } from './playlist-entry';

export class PlaylistDecodeResult {
    constructor(private _playlistName: string, private _playlistEntries: PlaylistEntry[]) {}

    public get playlistName(): string {
        return this._playlistName;
    }

    public get paths(): string[] {
        return this._playlistEntries != undefined && this._playlistEntries.length > 0
            ? this._playlistEntries.map((x) => x.decodedPath)
            : [];
    }
}
