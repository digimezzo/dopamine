import { TrackModel } from './track-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { DateTime } from '../../common/date-time';

export class TrackModels {
    private _totalDurationInMilliseconds: number = 0;
    private _totalFileSizeInBytes: number = 0;

    public tracks: TrackModel[] = [];

    public get totalDurationInMilliseconds(): number {
        return this._totalDurationInMilliseconds;
    }

    public get totalFileSizeInBytes(): number {
        return this._totalFileSizeInBytes;
    }

    public get numberOfTracks(): number {
        return this.tracks.length;
    }

    public addTrack(track: TrackModel | undefined): void {
        if (track == undefined) {
            return;
        }

        this.tracks.push(track);
        this._totalDurationInMilliseconds += track.durationInMilliseconds;
        this._totalFileSizeInBytes += track.fileSizeInBytes;
    }

    toJSON() {
        return {
            _totalDurationInMilliseconds: this._totalDurationInMilliseconds,
            _totalFileSizeInBytes: this._totalFileSizeInBytes,
            tracks: this.tracks.map((t) => t.toJSON()),
        };
    }

    static fromJSON(data: any, dateTime: DateTime, translatorService: TranslatorServiceBase): TrackModels {
        const instance = new TrackModels();
        instance._totalDurationInMilliseconds = data._totalDurationInMilliseconds ?? 0;
        instance._totalFileSizeInBytes = data._totalFileSizeInBytes ?? 0;
        instance.tracks = data.tracks?.map((t: any) => TrackModel.fromJSON(t, dateTime, translatorService)) ?? [];
        return instance;
    }
}
