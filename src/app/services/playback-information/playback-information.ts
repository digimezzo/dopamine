import { TrackModel } from '../track/track-model';

export class PlaybackInformation {
    public constructor(private _track: TrackModel, private _imageUrl: string) {}

    public get track(): TrackModel {
        return this._track;
    }

    public get imageUrl(): string {
        return this._imageUrl;
    }
}
