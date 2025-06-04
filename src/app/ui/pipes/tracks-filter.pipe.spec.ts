import { IMock, It, Mock, Times } from 'typemoq';
import { TracksFilterPipe } from './tracks-filter.pipe';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { SearchServiceBase } from '../../services/search/search.service.base';
import { DateTime } from '../../common/date-time';
import { TrackModels } from '../../services/track/track-models';
import { Track } from '../../data/entities/track';
import { TrackModel } from '../../services/track/track-model';
import { SettingsMock } from '../../testing/settings-mock';

describe('TracksFilterPipe', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;

    function createPipe(): TracksFilterPipe {
        return new TracksFilterPipe(searchServiceMock.object);
    }

    function createTrackModels(): TrackModels {
        const track1: Track = new Track('/path1/file1.mp3');
        track1.fileName = 'file1.mp3';
        track1.trackTitle = 'title1';
        track1.albumTitle = 'album1';
        track1.albumArtists = ';album_artist1_1;;album_artist1_2;';
        track1.artists = ';artist1_1;;artist1_2;';
        track1.year = 2001;
        track1.genres = ';genre1_1;;genre1_2';
        const track2: Track = new Track('/path2/file2.mp3');
        track2.fileName = 'file2.mp3';
        track2.trackTitle = 'title2';
        track2.albumTitle = 'album2';
        track2.albumArtists = ';album_artist2_1;;album_artist2_2;';
        track2.artists = ';artist2_1;;artist2_2;';
        track2.year = 2002;
        track2.genres = ';genre2_1;;genre2_2;';
        const trackModel1: TrackModel = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        const trackModel2: TrackModel = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        const trackModels: TrackModels = new TrackModels();
        trackModels.addTrack(trackModel1);
        trackModels.addTrack(trackModel2);

        return trackModels;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();
    });

    describe('transform', () => {
        it('should return the given trackModels if textToContain is undefined', () => {
            // Arrange
            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, undefined);

            // Assert
            expect(filteredTrackModels).toEqual(trackModels);
        });

        it('should return the given trackModels if textToContain is empty', () => {
            // Arrange
            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, '');

            // Assert
            expect(filteredTrackModels).toEqual(trackModels);
        });

        it('should return the given trackModels if textToContain is space', () => {
            // Arrange
            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, ' ');

            // Assert
            expect(filteredTrackModels).toEqual(trackModels);
        });

        it('performs search once for each track, searching "title", "album title", "album artists", "artists", "fileName", "year" and "genres', () => {
            // Arrange
            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            pipe.transform(trackModels, 'dummy');

            // Assert
            const expectedTextToSearchTrack1 =
                'title1 album1 album_artist1_1, album_artist1_2 artist1_1, artist1_2 file1.mp3 2001 genre1_1, genre1_2';
            const expectedTextToSearchTrack2 =
                'title2 album2 album_artist2_1, album_artist2_2 artist2_1, artist2_2 file2.mp3 2002 genre2_1, genre2_2';

            searchServiceMock.verify((x) => x.matchesSearchText(expectedTextToSearchTrack1, 'dummy'), Times.once());
            searchServiceMock.verify((x) => x.matchesSearchText(expectedTextToSearchTrack2, 'dummy'), Times.once());
        });

        it('should return only tracks for which search returns true', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText(It.isAny(), It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText(It.isAny(), It.isAny())).returns(() => true);

            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, 'dummy');

            // Assert
            expect(filteredTrackModels.tracks.length).toEqual(1);
            expect(filteredTrackModels.tracks[0]).toEqual(trackModels.tracks[1]);
        });
    });
});
