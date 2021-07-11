import { IMock, Mock } from 'typemoq';
import { GenreData } from '../../common/data/entities/genre-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { GenreModel } from './genre-model';
import { GenreService } from './genre.service';

describe('GenreService', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;

    let service: GenreService;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();

        service = new GenreService(translatorServiceMock.object, trackRepositoryMock.object);
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

            trackRepositoryMock.setup((x) => x.getGenreData()).returns(() => genreDatas);

            // Act
            const genres: GenreModel[] = service.getGenres();

            // Assert
            expect(genres.length).toEqual(16);
            expect(genres[0].name).toEqual('Alternative');
            expect(genres[1].name).toEqual('Rock');
            expect(genres[2].name).toEqual('Electro');
            expect(genres[3].name).toEqual('Dance');
            expect(genres[4].name).toEqual('Jazz');
            expect(genres[5].name).toEqual('Indie Rock');
            expect(genres[6].name).toEqual('Klassik');
            expect(genres[7].name).toEqual('Indie');
            expect(genres[8].name).toEqual('Electronic');
            expect(genres[9].name).toEqual('Indie Pop');
            expect(genres[10].name).toEqual('Pop');
            expect(genres[11].name).toEqual('Folk');
            expect(genres[12].name).toEqual('Classical');
            expect(genres[13].name).toEqual('Rock Pop');
            expect(genres[14].name).toEqual('Techno');
            expect(genres[15].name).toEqual('House');
        });
    });
});
