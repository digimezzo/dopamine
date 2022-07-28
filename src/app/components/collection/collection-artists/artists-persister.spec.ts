import { Subscription } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../common/logger';
import { ArtistModel } from '../../../services/artist/artist-model';
import { ArtistType } from '../../../services/artist/artist-type';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { ArtistOrder } from './artist-browser/artist-order';
import { ArtistsPersister } from './artists-persister';

describe('ArtistsPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let persister: ArtistsPersister;

    let subscription: Subscription;

    let artist1: ArtistModel;
    let artist2: ArtistModel;
    let artist3: ArtistModel;

    beforeEach(() => {
        settingsStub = { artistsTabSelectedArtist: '', artistsTabSelectedArtistOrder: '', artistsTabSelectedArtistType: '' };
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        persister = new ArtistsPersister(settingsStub, loggerMock.object);

        subscription = new Subscription();

        artist1 = new ArtistModel('artist 1', translatorServiceMock.object);
        artist2 = new ArtistModel('artist 2', translatorServiceMock.object);
        artist3 = new ArtistModel('artist 3', translatorServiceMock.object);
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
            settingsStub.artistsTabSelectedArtist = 'artist 1';
            settingsStub.artistsTabSelectedArtistOrder = 'byArtistDescending';
            settingsStub.artistsTabSelectedArtistType = 'albumArtists';
            persister = new ArtistsPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(persister.getSelectedArtists([artist1, artist2])).toEqual([artist1]);
            expect(persister.getSelectedArtistOrder()).toEqual(ArtistOrder.byArtistDescending);
            expect(persister.getSelectedArtistType()).toEqual(ArtistType.albumArtists);
        });
    });

    describe('getSelectedArtists', () => {
        it('should return an empty collection if availableArtists is undefined', () => {
            // Arrange
            settingsStub.artistsTabSelectedArtistOrder = 'byArtistDescending';
            persister = new ArtistsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedArtists: ArtistModel[] = persister.getSelectedArtists(undefined);

            // Assert
            expect(selectedArtists).toEqual([]);
        });

        it('should return an empty collection if availableArtists is empty', () => {
            // Arrange
            settingsStub.artistsTabSelectedArtistOrder = 'byArtistDescending';
            persister = new ArtistsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedArtists: ArtistModel[] = persister.getSelectedArtists([]);

            // Assert
            expect(selectedArtists).toEqual([]);
        });

        it('should return an empty collection if the selected artists are not found in availableArtists', () => {
            // Arrange
            settingsStub.artistsTabSelectedArtistOrder = 'byArtistDescending';
            persister = new ArtistsPersister(settingsStub, loggerMock.object);
            persister.setSelectedArtists([artist3]);

            // Act
            const selectedArtists: ArtistModel[] = persister.getSelectedArtists([artist1, artist2]);

            // Assert
            expect(selectedArtists).toEqual([]);
        });

        it('should return the selected artists if the selected artists are found in availableArtists', () => {
            // Arrange
            settingsStub.artistsTabSelectedArtistOrder = 'byArtistDescending';
            persister = new ArtistsPersister(settingsStub, loggerMock.object);
            persister.setSelectedArtists([artist1, artist2]);

            // Act
            const selectedArtists: ArtistModel[] = persister.getSelectedArtists([artist1, artist2]);

            // Assert
            expect(selectedArtists).toEqual([artist1, artist2]);
        });
    });

    describe('setSelectedArtists', () => {
        it('should clear the selected artists if selectedArtists is undefined', () => {
            // Arrange
            persister.setSelectedArtists([artist1, artist2]);

            // Act
            persister.setSelectedArtists(undefined);

            // Assert
            expect(persister.getSelectedArtists([artist1, artist2])).toEqual([]);
        });

        it('should clear the selected artists if selectedArtists is empty', () => {
            // Arrange
            persister.setSelectedArtists([artist1, artist2]);
            settingsStub.artistsTabSelectedArtist = 'artist 2';

            // Act
            persister.setSelectedArtists([]);

            // Assert
            expect(persister.getSelectedArtists([artist1, artist2])).toEqual([]);
            expect(settingsStub.artistsTabSelectedArtist).toEqual('');
        });

        it('should set the selected artists if selectedArtists has elements', () => {
            // Arrange
            persister.setSelectedArtists([artist1, artist2]);

            // Act
            persister.setSelectedArtists([artist1, artist3]);

            // Assert
            expect(persister.getSelectedArtists([artist3])).toEqual([artist3]);
            expect(settingsStub.artistsTabSelectedArtist).toEqual('artist 1');
        });

        it('should notify that the selected artists have changed', () => {
            // Arrange
            let receivedArtistNames: string[] = [];

            subscription.add(
                persister.selectedArtistsChanged$.subscribe((artistNames: string[]) => {
                    receivedArtistNames = artistNames;
                })
            );

            // Act
            persister.setSelectedArtists([artist1, artist3]);

            // Assert
            expect(receivedArtistNames.length).toEqual(2);
            expect(receivedArtistNames[0]).toEqual('artist 1');
            expect(receivedArtistNames[1]).toEqual('artist 3');
            subscription.unsubscribe();
        });
    });

    describe('getSelectedArtistType', () => {
        it('should TODO', () => {});
    });

    describe('setSelectedArtistType', () => {
        it('should set the selected artist type', () => {
            // Arrange

            // Act
            persister.setSelectedArtistType(ArtistType.albumArtists);

            // Assert
            expect(persister.getSelectedArtistType()).toEqual(ArtistType.albumArtists);
            expect(settingsStub.artistsTabSelectedArtistType).toEqual('albumArtists');
        });

        it('should reset the selected artist', () => {
            // Arrange
            persister.setSelectedArtists([artist3]);

            // Act
            persister.setSelectedArtistType(ArtistType.albumArtists);

            // Assert
            expect(persister.getSelectedArtistType()).toEqual(ArtistType.albumArtists);
            expect(persister.getSelectedArtists([artist3])).toEqual([]);
        });

        it('should notify that the selected artists type has changed', () => {
            // Arrange
            let receivedArtistType: ArtistType;

            subscription.add(
                persister.selectedArtistTypeChanged$.subscribe((artistType: ArtistType) => {
                    receivedArtistType = artistType;
                })
            );

            // Act
            persister.setSelectedArtistType(ArtistType.albumArtists);

            // Assert
            expect(receivedArtistType).toEqual(ArtistType.albumArtists);
            subscription.unsubscribe();
        });
    });
});
