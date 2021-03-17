import { IMock, Mock } from 'typemoq';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { CollectionGenresComponent } from './collection-genres.component';

describe('CollectionGenresComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let settingsStub: any;

    let component: CollectionGenresComponent;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        settingsStub = { genresLeftPaneWidthPercent: 25, genresRightPaneWidthPercent: 25 };
        component = new CollectionGenresComponent(playbackServiceMock.object, settingsStub);
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
            expect(component.leftPaneSize).toEqual(25);
        });

        it('should set center pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.centerPaneSize).toEqual(50);
        });

        it('should set right pane size from settings', async () => {
            // Arrange

            // Act

            // Assert
            expect(component.rightPaneSize).toEqual(25);
        });
    });

    describe('splitDragEnd', () => {
        it('should save the left pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.genresLeftPaneWidthPercent).toEqual(30);
        });

        it('should save the right pane width to the settings', async () => {
            // Arrange

            // Act
            component.splitDragEnd({ sizes: [30, 55, 15] });

            // Assert
            expect(settingsStub.genresRightPaneWidthPercent).toEqual(15);
        });
    });
});
