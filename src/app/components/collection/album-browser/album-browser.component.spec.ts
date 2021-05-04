import { IMock, Mock, Times } from 'typemoq';
import { Scheduler } from '../../../core/scheduler/scheduler';
import { AlbumData } from '../../../data/album-data';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { AlbumBrowserComponent } from './album-browser.component';
import { AlbumRowsGetter } from './album-rows-getter';

describe('AlbumBrowserComponent', () => {
    let albumRowsGetterMock: IMock<AlbumRowsGetter>;
    let schedulerMock: IMock<Scheduler>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let albumBrowserComponent: AlbumBrowserComponent;

    beforeEach(() => {
        albumRowsGetterMock = Mock.ofType<AlbumRowsGetter>();
        schedulerMock = Mock.ofType<Scheduler>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        albumBrowserComponent = new AlbumBrowserComponent(albumRowsGetterMock.object, schedulerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent).toBeDefined();
        });

        it('should define albumOrderEnum', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.albumOrderEnum).toBeDefined();
        });

        it('should define albumRows as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.albumRows).toBeDefined();
            expect(albumBrowserComponent.albumRows.length).toEqual(0);
        });

        it('should declare albumBrowserElement', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.albumBrowserElement).toBeUndefined();
        });

        it('should declare activeAlbumOrder', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.activeAlbumOrder).toBeUndefined();
        });

        it('should define activeAlbumOrderChange', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.activeAlbumOrderChange).toBeDefined();
        });

        it('should declare activeAlbum', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.activeAlbum).toBeUndefined();
        });

        it('should define activeAlbumChange', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.activeAlbumChange).toBeDefined();
        });

        it('should define albums as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(albumBrowserComponent.albums).toBeDefined();
            expect(albumBrowserComponent.albums.length).toEqual(0);
        });
    });

    describe('albums', () => {
        it('should fill the album rows', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            const albumData2: AlbumData = new AlbumData();
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);

            albumBrowserComponent.activeAlbumOrder = AlbumOrder.byAlbumArtist;

            // Act
            albumBrowserComponent.albums = [];

            // Assert
            albumRowsGetterMock.verify((x) => x.getAlbumRows(), Times.exactly(1));
        });
    });

    // describe('calculateNumberOfAlbumsPerRow', () => {
    //     it('should return 0 when albumWidth is undefined', () => {
    //         // Arrange
    //         const albumWidth: number = undefined;
    //         const availableWidth: number = 800;

    //         // Act
    //         const numberOfAlbumsPerRow: number = albumSpaceCalculator.calculateNumberOfAlbumsPerRow(albumWidth, availableWidth);

    //         // Assert
    //         expect(numberOfAlbumsPerRow).toEqual(0);
    //     });
    // });
});
