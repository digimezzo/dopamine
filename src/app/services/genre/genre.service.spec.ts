import { IMock, Mock, Times } from 'typemoq';
import { GenreModel } from './genre-model';
import { GenreService } from './genre.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { GenreData } from '../../data/entities/genre-data';
import { Logger } from '../../common/logger';

describe('GenreService', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let loggerMock: IMock<Logger>;
    let service: GenreService;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        loggerMock = Mock.ofType<Logger>();

        translatorServiceMock.setup((x) => x.get('unknown-genre')).returns(() => 'Unknown genre');

        service = new GenreService(translatorServiceMock.object, trackRepositoryMock.object, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getGenres', () => {
        it('should get all genres without duplicates', () => {
            // Arrange
            const genreDatas: GenreData[] = [];

            genreDatas.push(new GenreData(';Alternative;;Rock;'));
            genreDatas.push(new GenreData(';Electro;'));
            genreDatas.push(new GenreData(';Electro;Dance;'));
            genreDatas.push(new GenreData(';Jazz;'));
            genreDatas.push(new GenreData(';Alternative;Electro;'));
            genreDatas.push(new GenreData(';Alternative;Indie Rock;'));
            genreDatas.push(new GenreData(';Electro;;Dance;'));
            genreDatas.push(new GenreData(';Klassik;;Electro;'));
            genreDatas.push(new GenreData(';Alternative;Rock;'));
            genreDatas.push(new GenreData(';Rock;'));
            genreDatas.push(new GenreData(';rock;'));
            genreDatas.push(new GenreData(';Alternative;'));
            genreDatas.push(new GenreData(';Indie;'));
            genreDatas.push(new GenreData(';Electronic;'));
            genreDatas.push(new GenreData(';Alternative;;Indie Pop;;Indie Rock;;Pop;;Folk;;Rock;'));
            genreDatas.push(new GenreData(';Classical;Electro;'));
            genreDatas.push(new GenreData(';Electro;;Pop;;Rock;'));
            genreDatas.push(new GenreData(';Pop;'));
            genreDatas.push(new GenreData(';Classical;'));
            genreDatas.push(new GenreData(';Alternative;;Indie Rock;'));
            genreDatas.push(new GenreData(';Electro;;Dance;;Jazz;;Pop;;Rock;'));
            genreDatas.push(new GenreData(';Alternative;;Indie Rock;;Pop;;Rock;;Rock Pop;'));
            genreDatas.push(new GenreData(';Electro;;Techno;;House;'));
            genreDatas.push(new GenreData(''));

            trackRepositoryMock.setup((x) => x.getGenreData()).returns(() => genreDatas);

            // Act
            const genres: GenreModel[] = service.getGenres();

            // Assert
            expect(genres.length).toEqual(17);

            expect(genres[0].name).toEqual('Alternative');
            expect(genres[0].displayName).toEqual('Alternative');

            expect(genres[1].name).toEqual('Rock');
            expect(genres[1].displayName).toEqual('Rock');

            expect(genres[2].name).toEqual('Electro');
            expect(genres[2].displayName).toEqual('Electro');

            expect(genres[3].name).toEqual('Dance');
            expect(genres[3].displayName).toEqual('Dance');

            expect(genres[4].name).toEqual('Jazz');
            expect(genres[4].displayName).toEqual('Jazz');

            expect(genres[5].name).toEqual('Indie Rock');
            expect(genres[5].displayName).toEqual('Indie Rock');

            expect(genres[6].name).toEqual('Klassik');
            expect(genres[6].displayName).toEqual('Klassik');

            expect(genres[7].name).toEqual('Indie');
            expect(genres[7].displayName).toEqual('Indie');

            expect(genres[8].name).toEqual('Electronic');
            expect(genres[8].displayName).toEqual('Electronic');

            expect(genres[9].name).toEqual('Indie Pop');
            expect(genres[9].displayName).toEqual('Indie Pop');

            expect(genres[10].name).toEqual('Pop');
            expect(genres[10].displayName).toEqual('Pop');

            expect(genres[11].name).toEqual('Folk');
            expect(genres[11].displayName).toEqual('Folk');

            expect(genres[12].name).toEqual('Classical');
            expect(genres[12].displayName).toEqual('Classical');

            expect(genres[13].name).toEqual('Rock Pop');
            expect(genres[13].displayName).toEqual('Rock Pop');

            expect(genres[14].name).toEqual('Techno');
            expect(genres[14].displayName).toEqual('Techno');

            expect(genres[15].name).toEqual('House');
            expect(genres[15].displayName).toEqual('House');

            expect(genres[16].name).toEqual('');
            expect(genres[16].displayName).toEqual('Unknown genre');

            translatorServiceMock.verify((x) => x.get('unknown-genre'), Times.once());
        });
    });
});
