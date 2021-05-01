import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../core/logger';
import { BaseAlbumService } from '../../../services/album/base-album-service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { AlbumsPersister } from './albums-persister';
import { CollectionAlbumsComponent } from './collection-albums.component';

describe('CollectionAlbumsComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let albumServiceMock: IMock<BaseAlbumService>;
    let albumsPersisterMock: IMock<AlbumsPersister>;
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    let component: CollectionAlbumsComponent;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        albumServiceMock = Mock.ofType<BaseAlbumService>();
        albumsPersisterMock = Mock.ofType<AlbumsPersister>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };

        component = new CollectionAlbumsComponent(
            playbackServiceMock.object,
            albumServiceMock.object,
            albumsPersisterMock.object,
            settingsStub,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define playbackService', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should set left pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.leftPaneSize).toEqual(70);
        });

        it('should set right pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.rightPaneSize).toEqual(30);
        });
    });

    describe('splitDragEnd', () => {
        it('should save the right pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [60, 40] });

            // Assert
            expect(settingsStub.albumsRightPaneWidthPercent).toEqual(40);
        });
    });
});
