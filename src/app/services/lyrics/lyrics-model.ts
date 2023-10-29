import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';

export class LyricsModel {
    public constructor(
        public sourceName: string,
        public sourceType: LyricsSourceType,
        public text: string,
    ) {}

    public static default(): LyricsModel {
        return new LyricsModel('', LyricsSourceType.none, '');
    }
}
