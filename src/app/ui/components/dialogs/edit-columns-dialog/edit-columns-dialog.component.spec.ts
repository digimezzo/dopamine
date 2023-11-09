import { IMock, Mock, Times } from 'typemoq';
import { EditColumnsDialogComponent } from './edit-columns-dialog.component';
import { TracksColumnsServiceBase } from '../../../../services/track-columns/tracks-columns.service.base';
import { TracksColumnsVisibility } from '../../../../services/track-columns/tracks-columns-visibility';

describe('EditColumnsDialogComponent', () => {
    let component: EditColumnsDialogComponent;
    let tracksColumnsServiceMock: IMock<TracksColumnsServiceBase>;

    beforeEach(() => {
        tracksColumnsServiceMock = Mock.ofType<TracksColumnsServiceBase>();

        component = new EditColumnsDialogComponent(tracksColumnsServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define tracksColumnsVisibility', () => {
            // Arrange

            // Act

            // Assert
            expect(component.tracksColumnsVisibility).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should get tracksColumnsVisibility', () => {
            // Arrange
            const tracksColumnsVisibility: TracksColumnsVisibility = new TracksColumnsVisibility();
            tracksColumnsVisibility.showDateLastPlayed = true;
            tracksColumnsServiceMock.setup((x) => x.getTracksColumnsVisibility()).returns(() => tracksColumnsVisibility);

            // Act
            component.ngOnInit();

            // Assert
            tracksColumnsServiceMock.verify((x) => x.getTracksColumnsVisibility(), Times.once());
            expect(component.tracksColumnsVisibility).toBe(tracksColumnsVisibility);
            expect(component.tracksColumnsVisibility.showDateLastPlayed).toBeTruthy();
        });
    });

    describe('setTracksColumnsVisibility', () => {
        it('should set tracksColumnsVisibility', () => {
            // Arrange

            // Act
            component.setTracksColumnsVisibility();

            // Assert
            tracksColumnsServiceMock.verify((x) => x.setTracksColumnsVisibility(component.tracksColumnsVisibility), Times.once());
        });
    });
});
