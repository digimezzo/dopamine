import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';

export class LyricsModel {
    public constructor(
        public track: TrackModel | undefined,
        public sourceName: string,
        public sourceType: LyricsSourceType,
        public text: string,
    ) {}

    public static default(): LyricsModel {
        return new LyricsModel(undefined, '', LyricsSourceType.none, '');
    }
}
