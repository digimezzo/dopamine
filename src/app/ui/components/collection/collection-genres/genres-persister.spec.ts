import { Subscription } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../common/logger';
import { GenreModel } from '../../../services/genre/genre-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { GenreOrder } from './genre-browser/genre-order';
import { GenresPersister } from './genres-persister';

describe('GenresPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let persister: GenresPersister;

    let subscription: Subscription;

    let genre1: GenreModel;
    let genre2: GenreModel;
    let genre3: GenreModel;

    beforeEach(() => {
        settingsStub = { genresTabSelectedGenre: '', genresTabSelectedGenreOrder: '' };
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        persister = new GenresPersister(settingsStub, loggerMock.object);

        subscription = new Subscription();

        genre1 = new GenreModel('genre 1', translatorServiceMock.object);
        genre2 = new GenreModel('genre 2', translatorServiceMock.object);
        genre3 = new GenreModel('genre 3', translatorServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(persister).toBeDefined();
        });

        it('should initialize from the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedGenre = 'genre 1';
            settingsStub.genresTabSelectedGenreOrder = 'byGenreDescending';
            persister = new GenresPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(persister.getSelectedGenres([genre1, genre2])).toEqual([genre1]);
            expect(persister.getSelectedGenreOrder()).toEqual(GenreOrder.byGenreDescending);
        });
    });

    describe('getSelectedGenres', () => {
        it('should return an empty collection if availableGenres is undefined', () => {
            // Arrange
            settingsStub.genresTabSelectedGenreOrder = 'byGenreDescending';
            persister = new GenresPersister(settingsStub, loggerMock.object);

            // Act
            const selectedGenres: GenreModel[] = persister.getSelectedGenres(undefined);

            // Assert
            expect(selectedGenres).toEqual([]);
        });

        it('should return an empty collection if availableGenres is empty', () => {
            // Arrange
            settingsStub.genresTabSelectedGenreOrder = 'byGenreDescending';
            persister = new GenresPersister(settingsStub, loggerMock.object);

            // Act
            const selectedGenres: GenreModel[] = persister.getSelectedGenres([]);

            // Assert
            expect(selectedGenres).toEqual([]);
        });

        it('should return an empty collection if the selected genres are not found in availableGenres', () => {
            // Arrange
            settingsStub.genresTabSelectedGenreOrder = 'byGenreDescending';
            persister = new GenresPersister(settingsStub, loggerMock.object);
            persister.setSelectedGenres([genre3]);

            // Act
            const selectedGenres: GenreModel[] = persister.getSelectedGenres([genre1, genre2]);

            // Assert
            expect(selectedGenres).toEqual([]);
        });

        it('should return the selected genres if the selected genres are found in availableGenres', () => {
            // Arrange
            settingsStub.genresTabSelectedGenreOrder = 'byGenreDescending';
            persister = new GenresPersister(settingsStub, loggerMock.object);
            persister.setSelectedGenres([genre1, genre2]);

            // Act
            const selectedGenres: GenreModel[] = persister.getSelectedGenres([genre1, genre2]);

            // Assert
            expect(selectedGenres).toEqual([genre1, genre2]);
        });
    });

    describe('setSelectedGenres', () => {
        it('should clear the selected genres if selectedGenres is undefined', () => {
            // Arrange
            persister.setSelectedGenres([genre1, genre2]);

            // Act
            persister.setSelectedGenres(undefined);

            // Assert
            expect(persister.getSelectedGenres([genre1, genre2])).toEqual([]);
        });

        it('should clear the selected genres if selectedGenres is empty', () => {
            // Arrange
            persister.setSelectedGenres([genre1, genre2]);
            settingsStub.genresTabSelectedGenre = 'genre 2';

            // Act
            persister.setSelectedGenres([]);

            // Assert
            expect(persister.getSelectedGenres([genre1, genre2])).toEqual([]);
            expect(settingsStub.genresTabSelectedGenre).toEqual('');
        });

        it('should set the selected genres if selectedGenres has elements', () => {
            // Arrange
            persister.setSelectedGenres([genre1, genre2]);

            // Act
            persister.setSelectedGenres([genre1, genre3]);

            // Assert
            expect(persister.getSelectedGenres([genre3])).toEqual([genre3]);
            expect(settingsStub.genresTabSelectedGenre).toEqual('genre 1');
        });

        it('should notify that the selected genres have changed', () => {
            // Arrange
            let receivedGenreNames: string[] = [];

            subscription.add(
                persister.selectedGenresChanged$.subscribe((genreNames: string[]) => {
                    receivedGenreNames = genreNames;
                })
            );

            // Act
            persister.setSelectedGenres([genre1, genre3]);

            // Assert
            expect(receivedGenreNames.length).toEqual(2);
            expect(receivedGenreNames[0]).toEqual('genre 1');
            expect(receivedGenreNames[1]).toEqual('genre 3');
            subscription.unsubscribe();
        });
    });

    describe('setSelectedGenreOrder', () => {
        it('should set the selected genre order', () => {
            // Arrange

            // Act
            persister.setSelectedGenreOrder(GenreOrder.byGenreDescending);

            // Assert
            expect(persister.getSelectedGenreOrder()).toEqual(GenreOrder.byGenreDescending);
            expect(settingsStub.genresTabSelectedGenreOrder).toEqual('byGenreDescending');
        });
    });
});
