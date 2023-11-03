import { BaseLyricsService } from './base-lyrics.service';
import { LyricsService } from './lyrics.service';
import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../playback/base-playback.service';
import { BasePlaybackInformationService } from '../playback-information/base-playback-information.service';
import { BaseMediaSessionProxy } from '../../common/io/base-media-session-proxy';
import { Subject } from 'rxjs';
import { PlaybackInformation } from '../playback-information/playback-information';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseFileMetadataFactory } from '../../common/metadata/base-file-metadata-factory';
import { MockCreator } from '../../testing/mock-creator';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { Lyrics } from '../../common/api/lyrics/lyrics';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';

describe('EmbeddedLyricsGetter', () => {
    let fileMetadataFactoryMock: IMock<BaseFileMetadataFactory>;

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<BaseFileMetadataFactory>();
    });

    function createInstance(): EmbeddedLyricsGetter {
        return new EmbeddedLyricsGetter(fileMetadataFactoryMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: EmbeddedLyricsGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return the file metadata lyrics', async () => {
            // Arrange
            const track = MockCreator.createTrackModel('path', 'title', 'artists');
            const metadataMock: IFileMetadata = { lyrics: 'lyrics' } as IFileMetadata;
            fileMetadataFactoryMock.setup((x) => x.createAsync(track.path)).returns(() => Promise.resolve(metadataMock));
            const instance: EmbeddedLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            expect(lyrics.text).toEqual('lyrics');
        });
    });
});
