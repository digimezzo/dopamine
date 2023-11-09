import { IMock, Mock } from 'typemoq';
import { TrackOrder } from '../track-order';
import { FolderTracksPersister } from './folder-tracks-persister';
import { Logger } from '../../../../common/logger';

describe('FolderTracksPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    let persister: FolderTracksPersister;

    beforeEach(() => {
        settingsStub = {};
        loggerMock = Mock.ofType<Logger>();
        persister = new FolderTracksPersister(settingsStub, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(persister).toBeDefined();
        });

        it('should initialize and set TrackOrder.none', () => {
            // Arrange
            persister = new FolderTracksPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(persister.getSelectedTrackOrder()).toEqual(TrackOrder.none);
        });
    });

    describe('getSelectedTrackOrderFromSettings', () => {
        it('should return empty string', () => {
            // Arrange
            persister = new FolderTracksPersister(settingsStub, loggerMock.object);

            // Act
            const selectedTrackOrderFromSettings: string = persister.getSelectedTrackOrderFromSettings();

            // Assert
            expect(selectedTrackOrderFromSettings).toEqual('none');
        });
    });

    describe('getSelectedTrackOrder', () => {
        it('should return none', () => {
            // Arrange

            // Act
            const selectedTrackOrder: TrackOrder = persister.getSelectedTrackOrder();

            // Assert
            expect(selectedTrackOrder).toEqual(TrackOrder.none);
        });
    });
});
