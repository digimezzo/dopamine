import { IMock, Mock } from 'typemoq';
import { TrackOrder } from '../track-order';
import { FolderTracksPersister } from './folder-tracks-persister';
import { Logger } from '../../../../common/logger';

describe('FolderTracksPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    let persister: FolderTracksPersister;

    beforeEach(() => {
        settingsStub = { foldersTabSelectedTrackOrder: '' };
        loggerMock = Mock.ofType<Logger>();
        persister = new FolderTracksPersister(settingsStub, loggerMock.object);
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
            settingsStub.foldersTabSelectedTrackOrder = 'byTrackTitleDescending';
            persister = new FolderTracksPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(persister.getSelectedTrackOrder()).toEqual(TrackOrder.byTrackTitleDescending);
        });
    });

    describe('getSelectedTrackOrderFromSettings', () => {
        it('should get the selected track order from the settings', () => {
            // Arrange
            settingsStub.foldersTabSelectedTrackOrder = 'byTrackTitleDescending';
            persister = new FolderTracksPersister(settingsStub, loggerMock.object);

            // Act
            const selectedTrackOrderFromSettings: string = persister.getSelectedTrackOrderFromSettings();

            // Assert
            expect(selectedTrackOrderFromSettings).toEqual('byTrackTitleDescending');
        });
    });

    describe('saveSelectedTrackOrderToSettings', () => {
        it('should save the selected track order to the settings', () => {
            // Arrange
            settingsStub.foldersTabSelectedTrackOrder = '';
            persister = new FolderTracksPersister(settingsStub, loggerMock.object);

            // Act
            persister.saveSelectedTrackOrderToSettings('byTrackTitleDescending');

            // Assert
            expect(settingsStub.foldersTabSelectedTrackOrder).toEqual('byTrackTitleDescending');
        });
    });

    describe('getSelectedTrackOrder', () => {
        it('should return none if there is no selected track order', () => {
            // Arrange

            // Act
            const selectedTrackOrder: TrackOrder = persister.getSelectedTrackOrder();

            // Assert
            expect(selectedTrackOrder).toEqual(TrackOrder.none);
        });

        it('should return the selected track order if there is a selected track order', () => {
            // Arrange
            settingsStub.foldersTabSelectedTrackOrder = 'byTrackTitleDescending';
            persister = new FolderTracksPersister(settingsStub, loggerMock.object);

            // Act
            const selectedTrackOrder: TrackOrder = persister.getSelectedTrackOrder();

            // Assert
            expect(selectedTrackOrder).toEqual(TrackOrder.byTrackTitleDescending);
        });
    });

    describe('setSelectedTrackOrder', () => {
        it('should set the selected track order', () => {
            // Arrange

            // Act
            persister.setSelectedTrackOrder(TrackOrder.byTrackTitleDescending);

            // Assert
            expect(persister.getSelectedTrackOrder()).toEqual(TrackOrder.byTrackTitleDescending);
        });

        it('should save the selected track order to the settings', () => {
            // Arrange

            // Act
            persister.setSelectedTrackOrder(TrackOrder.byTrackTitleDescending);

            // Assert
            expect(settingsStub.foldersTabSelectedTrackOrder).toEqual('byTrackTitleDescending');
        });
    });
});
