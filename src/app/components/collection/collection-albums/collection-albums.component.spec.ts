import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { CollectionAlbumsComponent } from './collection-albums.component';

describe('CollectionAlbumsComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let settingsStub: any;

    let component: CollectionAlbumsComponent;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        settingsStub = { albumsRightPaneWidthPercent: 30 };
        component = new CollectionAlbumsComponent(playbackServiceMock.object, settingsStub);
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
            settingsStub.albumsRightPaneWidthPercent = 45;

            // Act
            component.splitDragEnd({ sizes: [70, 30] });

            // Assert
            expect(settingsStub.albumsRightPaneWidthPercent).toEqual(30);
        });
    });
});
