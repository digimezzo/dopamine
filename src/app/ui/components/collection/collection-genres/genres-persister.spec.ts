import { Subscription } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { GenreOrder } from './genre-browser/genre-order';
import { GenresPersister } from './genres-persister';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { Logger } from '../../../../common/logger';
import { GenreModel } from '../../../../services/genre/genre-model';

describe('GenresPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    let persister: GenresPersister;

    let subscription: Subscription;

    let genre1: GenreModel;
    let genre2: GenreModel;
    let genre3: GenreModel;

    beforeEach(() => {
        settingsStub = { genresTabSelectedGenre: '', genresTabSelectedGenreOrder: '' };
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        persister = new GenresPersister(settingsStub, loggerMock.object);

        subscription = new Subscription();

        genre1 = new GenreModel('genre 1', translatorServiceMock.object);
        genre2 = new GenreModel('genre 2', translatorServiceMock.object);
        genre3 = new GenreModel('', translatorServiceMock.object);
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
            expect(persister.getSelectedGenres([genre1, genre2, genre3])).toEqual([genre1]);
            expect(persister.getSelectedGenreOrder()).toEqual(GenreOrder.byGenreDescending);
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
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
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
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
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
        });
    });

    describe('setSelectedGenres', () => {
        it('should clear the selected genres if selectedGenres is undefined', () => {
            // Arrange
            persister.setSelectedGenres([genre1, genre2, genre3]);

            // Act
            persister.setSelectedGenres(undefined);

            // Assert
            expect(persister.getSelectedGenres([genre1, genre2, genre3])).toEqual([]);
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
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
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
        });

        it('should set the selected genres if selectedGenres has elements', () => {
            // Arrange
            persister.setSelectedGenres([genre1, genre2]);

            // Act
            persister.setSelectedGenres([genre1, genre3]);

            // Assert
            expect(persister.getSelectedGenres([genre3])).toEqual([genre3]);
            expect(settingsStub.genresTabSelectedGenre).toEqual('genre 1');
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
        });

        it('should notify that the selected genres have changed', () => {
            // Arrange
            let receivedGenreNames: string[] = [];

            subscription.add(
                persister.selectedGenresChanged$.subscribe((genreNames: string[]) => {
                    receivedGenreNames = genreNames;
                }),
            );

            // Act
            persister.setSelectedGenres([genre1, genre3]);

            // Assert
            expect(receivedGenreNames.length).toEqual(2);
            expect(receivedGenreNames[0]).toEqual('genre 1');
            expect(receivedGenreNames[1]).toEqual('');
            subscription.unsubscribe();
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
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
