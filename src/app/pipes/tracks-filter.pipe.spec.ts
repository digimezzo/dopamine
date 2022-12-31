import { IMock, It, Mock } from 'typemoq';
import { Track } from '../common/data/entities/track';
import { DateTime } from '../common/date-time';
import { BaseSearchService } from '../services/search/base-search.service';
import { TrackModel } from '../services/track/track-model';
import { TrackModels } from '../services/track/track-models';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { TracksFilterPipe } from './tracks-filter.pipe';

describe('TracksFilterPipe', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createPipe(): TracksFilterPipe {
        return new TracksFilterPipe(searchServiceMock.object);
    }

    function createTrackModels(): TrackModels {
        const track1: Track = new Track('/path1/file1.mp3');
        track1.fileName = 'file1.mp3';
        track1.trackTitle = 'title1';
        track1.albumArtists = ';album_artist1_1;;album_artist1_2;';
        track1.artists = ';artist1_1;;artist1_2;';
        track1.year = 2001;
        const track2: Track = new Track('/path2/file2.mp3');
        track2.fileName = 'file2.mp3';
        track2.trackTitle = 'title2';
        track2.albumArtists = ';album_artist2_1;;album_artist2_2;';
        track2.artists = ';artist2_1;;artist2_2;';
        track2.year = 2002;
        const trackModel1: TrackModel = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        const trackModel2: TrackModel = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
        const trackModels: TrackModels = new TrackModels();
        trackModels.addTrack(trackModel1);
        trackModels.addTrack(trackModel2);

        return trackModels;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
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

        it('should return only trackModels with a title containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('title1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1, album_artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1, album_artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist1_1, artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2_1, artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file1.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file2.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, 'dummy');

            // Assert
            expect(filteredTrackModels.tracks.length).toEqual(1);
            expect(filteredTrackModels.tracks[0]).toEqual(trackModels.tracks[0]);
        });

        it('should return only trackModels with album artists containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('title1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1, album_artist1_2', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1, album_artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist1_1, artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2_1, artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file1.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file2.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, 'dummy');

            // Assert
            expect(filteredTrackModels.tracks.length).toEqual(1);
            expect(filteredTrackModels.tracks[0]).toEqual(trackModels.tracks[0]);
        });

        it('should return only trackModels with artists containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('title1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1, album_artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1, album_artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist1_1, artist1_2', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2_1, artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file1.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file2.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, 'dummy');

            // Assert
            expect(filteredTrackModels.tracks.length).toEqual(1);
            expect(filteredTrackModels.tracks[0]).toEqual(trackModels.tracks[0]);
        });

        it('should return only trackModels with a file name containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('title1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1, album_artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1, album_artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist1_1, artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2_1, artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file1.mp3', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('file2.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, 'dummy');

            // Assert
            expect(filteredTrackModels.tracks.length).toEqual(1);
            expect(filteredTrackModels.tracks[0]).toEqual(trackModels.tracks[0]);
        });

        it('should return only trackModels with a year containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('title1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1, album_artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1, album_artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist1_1, artist1_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2_1, artist2_2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file1.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('file2.mp3', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const trackModels: TrackModels = createTrackModels();
            const pipe: TracksFilterPipe = createPipe();

            // Act
            const filteredTrackModels: TrackModels = pipe.transform(trackModels, 'dummy');

            // Assert
            expect(filteredTrackModels.tracks.length).toEqual(1);
            expect(filteredTrackModels.tracks[0]).toEqual(trackModels.tracks[0]);
        });
    });
});
