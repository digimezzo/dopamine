import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';

export class LyricsModel {
    public constructor(
        public track: TrackModel | undefined,
        public sourceName: string,
        public sourceType: LyricsSourceType,
        public plainText: string,
        public textLines: string[] | undefined,
        public startTimeStamps: number[] | undefined,
        public endTimeStamps: number[] | undefined,
    ) {}

    public static plain(track: TrackModel | undefined, sourceName: string, sourceType: LyricsSourceType, text: string): LyricsModel {
        return new LyricsModel(track, sourceName, sourceType, text, [], [], []);
    }

    public static timed(
        track: TrackModel | undefined,
        sourceName: string,
        sourceType: LyricsSourceType,
        text: string,
        lyricList: string[],
        startTimeStamps: number[],
    ): LyricsModel {
        return new LyricsModel(track, sourceName, sourceType, text, lyricList, startTimeStamps, []);
    }

    public static doubleTimed(
        track: TrackModel | undefined,
        sourceName: string,
        sourceType: LyricsSourceType,
        text: string,
        lyricList: string[],
        startTimeStamps: number[],
        endTimeStamps: number[],
    ): LyricsModel {
        return new LyricsModel(track, sourceName, sourceType, text, lyricList, startTimeStamps, endTimeStamps);
    }

    public static empty(track: TrackModel | undefined): LyricsModel {
        return new LyricsModel(track, '', LyricsSourceType.none, '', [], [], []);
    }
}
