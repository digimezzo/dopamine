import { IMock, It, Mock } from 'typemoq';
import { Track } from '../common/data/entities/track';
import { GenreModel } from '../services/genre/genre-model';
import { BaseSearchService } from '../services/search/base-search.service';
import { TrackModel } from '../services/track/track-model';
import { TrackModels } from '../services/track/track-models';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { GenresFilterPipe } from './genres-filter.pipe';
import { TracksFilterPipe } from './tracks-filter.pipe';

describe('TracksFilterPipe', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createPipe(): TracksFilterPipe {
        return new TracksFilterPipe(searchServiceMock.object);
    }

    function createTrackModels(): TrackModels {
        const track1: Track = new Track('path1');
        const track2: Track = new Track('path2');
        const trackModel1: TrackModel = new TrackModel(track1, translatorServiceMock.object);
        const trackModel2: TrackModel = new TrackModel(track2, translatorServiceMock.object);
        const trackModels: TrackModels = new TrackModels();
        trackModels.addTrack(trackModel1);
        trackModels.addTrack(trackModel2);

        return trackModels;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
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

        it('should return only genres with a name containing the search text', () => {
            // Arrange

            const genres: GenreModel[] = createGenres();
            searchServiceMock.setup((x) => x.matchesSearchText('genre1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('genre2', It.isAny())).returns(() => false);
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, 'dummy');

            // Assert
            expect(filteredGenres.length).toEqual(1);
            expect(filteredGenres[0]).toEqual(genres[0]);
        });

        it('should return no artists if none of their names contain the search text', () => {
            // Arrange

            const genres: GenreModel[] = createGenres();
            searchServiceMock.setup((x) => x.matchesSearchText('genre1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('genre2', It.isAny())).returns(() => false);
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, 'dummy');

            // Assert
            expect(filteredGenres.length).toEqual(0);
        });
    });
});
