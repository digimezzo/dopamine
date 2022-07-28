import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../common/logger';
import { TrackOrder } from '../track-order';
import { GenresTracksPersister } from './genres-tracks-persister';

describe('GenresTracksPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    let persister: GenresTracksPersister;

    beforeEach(() => {
        settingsStub = { genresTabSelectedTrackOrder: '' };
        loggerMock = Mock.ofType<Logger>();
        persister = new GenresTracksPersister(settingsStub, loggerMock.object);
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
            settingsStub.genresTabSelectedTrackOrder = 'byTrackTitleDescending';
            persister = new GenresTracksPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(persister.getSelectedTrackOrder()).toEqual(TrackOrder.byTrackTitleDescending);
        });
    });

    describe('getSelectedTrackOrderFromSettings', () => {
        it('should get the selected track order from the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedTrackOrder = 'byTrackTitleDescending';
            persister = new GenresTracksPersister(settingsStub, loggerMock.object);

            // Act
            const selectedTrackOrderFromSettings: string = persister.getSelectedTrackOrderFromSettings();

            // Assert
            expect(selectedTrackOrderFromSettings).toEqual('byTrackTitleDescending');
        });
    });

    describe('saveSelectedTrackOrderToSettings', () => {
        it('should save the selected track order to the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedTrackOrder = '';
            persister = new GenresTracksPersister(settingsStub, loggerMock.object);

            // Act
            persister.saveSelectedTrackOrderToSettings('byTrackTitleDescending');

            // Assert
            expect(settingsStub.genresTabSelectedTrackOrder).toEqual('byTrackTitleDescending');
        });
    });

    describe('getSelectedTrackOrder', () => {
        it('should return byAlbum if there is no selected track order', () => {
            // Arrange

            // Act
            const selectedTrackOrder: TrackOrder = persister.getSelectedTrackOrder();

            // Assert
            expect(selectedTrackOrder).toEqual(TrackOrder.byAlbum);
        });

        it('should return the selected track order if there is a selected track order', () => {
            // Arrange
            settingsStub.genresTabSelectedTrackOrder = 'byTrackTitleDescending';
            persister = new GenresTracksPersister(settingsStub, loggerMock.object);

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
            expect(settingsStub.genresTabSelectedTrackOrder).toEqual('byTrackTitleDescending');
        });
    });
});
