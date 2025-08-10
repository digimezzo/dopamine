import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';

export class LyricsModel {
    public constructor(
        public track: TrackModel | undefined,
        public sourceName: string,
        public sourceType: LyricsSourceType,
        public text: string,
        public lyricList: string[] | undefined,
        public timeStamps: number[] | undefined,
        public timeStampEnds: number[] | undefined
    ) {}

    public static createWithoutEnds(track: TrackModel | undefined, sourceName: string, sourceType: LyricsSourceType, text: string, lyricList: string[], timeStamps: number[]): LyricsModel {
        return new LyricsModel(track, sourceName, sourceType, text, lyricList, timeStamps, undefined);
    }

    public static createSimple(track: TrackModel | undefined, sourceName: string, sourceType: LyricsSourceType, text: string): LyricsModel {
        return new LyricsModel(track, sourceName, sourceType, text, undefined, undefined, undefined);
    }

    public static empty(track: TrackModel | undefined): LyricsModel {
        return new LyricsModel(track, '', LyricsSourceType.none, '', undefined, undefined, undefined);
    }
}
