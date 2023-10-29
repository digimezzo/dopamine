import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { IMock, Mock } from 'typemoq';
import { ChartLyricsApi } from '../../common/api/lyrics/chart-lyrics-api';
import { BaseFileMetadataFactory } from '../../common/metadata/base-file-metadata-factory';
import { Lyrics } from '../../common/api/lyrics/lyrics';

describe('OnlineLyricsGetter', () => {
    let chartLyricsApiMock: IMock<ChartLyricsApi>;

    beforeEach(() => {
        chartLyricsApiMock = Mock.ofType<ChartLyricsApi>();
    });

    function createInstance(): OnlineLyricsGetter {
        return new OnlineLyricsGetter(chartLyricsApiMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: OnlineLyricsGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return the online lyrics', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', 'title', 'artists');
            const lyrics: Lyrics = new Lyrics('online source', 'online text');
            chartLyricsApiMock.setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.title)).returns(() => Promise.resolve(lyrics));
            const instance: OnlineLyricsGetter = createInstance();

            // Act
            const lyricsModel: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyricsModel.sourceName).toEqual('online source');
            expect(lyricsModel.sourceType).toEqual(LyricsSourceType.online);
            expect(lyricsModel.text).toEqual('online text');
        });
    });
});
