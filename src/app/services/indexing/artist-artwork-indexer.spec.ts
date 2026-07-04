import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { ArtistArtworkAdder } from './artist-artwork-adder';
import { ArtistArtworkIndexer } from './artist-artwork-indexer';
import { ArtistArtworkRemover } from './artist-artwork-remover';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { SettingsMock } from '../../testing/settings-mock';
import {TrackRepositoryBase} from "../../data/repositories/track-repository.base";
import {ArtistsKeyGenerator} from "../../data/artists-key-generator";
import {ArtistData} from "../../data/entities/artist-data";

describe('ArtistArtworkIndexer', () => {
    let artistArtworkRemoverMock: IMock<ArtistArtworkRemover>;
    let artistArtworkAdderMock: IMock<ArtistArtworkAdder>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let trackRepositoryBase: IMock<TrackRepositoryBase>;
    let artistsKeyGenerator: IMock<ArtistsKeyGenerator>;
    let loggerMock: IMock<Logger>;
    let artistArtworkIndexer: ArtistArtworkIndexer;
    let settingsMock: SettingsMock;

    beforeEach(() => {
        artistArtworkRemoverMock = Mock.ofType<ArtistArtworkRemover>();
        artistArtworkAdderMock = Mock.ofType<ArtistArtworkAdder>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        trackRepositoryBase = Mock.ofType<TrackRepositoryBase>();
        artistsKeyGenerator = Mock.ofType<ArtistsKeyGenerator>();
        loggerMock = Mock.ofType<Logger>();
        settingsMock = new SettingsMock();
        artistArtworkIndexer = new ArtistArtworkIndexer(
            artistArtworkRemoverMock.object,
            artistArtworkAdderMock.object,
            notificationServiceMock.object,
            trackRepositoryBase.object,
            artistsKeyGenerator.object,
            loggerMock.object,
            settingsMock,
        );

        settingsMock.showArtistImages = true;
    });

    describe('indexArtistArtworkAsync', () => {
        it('should do nothing if showing artist images is disabled in the settings', async () => {
            // Arrange
            settingsMock.showArtistImages = false;

            // Act
            await artistArtworkIndexer.indexArtistArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatHasNoTrackAsync(), Times.never());
            artistArtworkAdderMock.verify((x) => x.addMissingArtistArtworkAsync(), Times.never());
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.never());
        });

        it('should remove artwork that has no track', async () => {
            // Arrange, Act
            await artistArtworkIndexer.indexArtistArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatHasNoTrackAsync(), Times.once());
        });

        it('should add artwork for tracks that need artist artwork indexing', async () => {
            // Arrange, Act
            await artistArtworkIndexer.indexArtistArtworkAsync();

            // Assert
            artistArtworkAdderMock.verify((x) => x.addMissingArtistArtworkAsync(), Times.once());
        });

        it('should remove artwork that is not in the database from disk', async () => {
            // Arrange, Act
            await artistArtworkIndexer.indexArtistArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.once());
        });

        it('should dismiss the indexing notification', async () => {
            // Arrange, Act
            await artistArtworkIndexer.indexArtistArtworkAsync();

            // Assert
            notificationServiceMock.verify((x) => x.dismiss(), Times.once());
        });

        it('should generate an artistsKey for tracks that have no artistsKey', async () => {
            // Arrange
            const artist1: ArtistData = new ArtistData(';Artist 1;');
            const artist2: ArtistData = new ArtistData(';Artist 2;');
            const artist3: ArtistData = new ArtistData(';Artist 3;');
            trackRepositoryBase.setup((x) => x.getArtistsWithoutArtistsKey()).returns(() => [artist1, artist2, artist3]);
            artistsKeyGenerator.setup((x) => x.generateArtistsKey(';Artist 1;')).returns(() => 'artist-key-1');
            artistsKeyGenerator.setup((x) => x.generateArtistsKey(';Artist 2;')).returns(() => 'artist-key-2');
            artistsKeyGenerator.setup((x) => x.generateArtistsKey(';Artist 3;')).returns(() => 'artist-key-3');

            // Act
            await artistArtworkIndexer.indexArtistArtworkAsync();

            // Assert
            trackRepositoryBase.verify((x) => x.updateArtistsKey(';Artist 1;', 'artist-key-1'), Times.once());
            trackRepositoryBase.verify((x) => x.updateArtistsKey(';Artist 2;', 'artist-key-2'), Times.once());
            trackRepositoryBase.verify((x) => x.updateArtistsKey(';Artist 3;', 'artist-key-3'), Times.once());
        });
    });

    describe('refreshAllArtistsArtworkAsync', () => {
        it('should show the indexing notification', async () => {
            // Arrange, Act
            await artistArtworkIndexer.refreshAllArtistsArtworkAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.once());
        });

        it('should delete all artist artwork from cache', async () => {
            // Arrange, Act
            await artistArtworkIndexer.refreshAllArtistsArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeAllArtistArtworkAsync(), Times.once());
        });

        it('should restart indexing artist artwork', async () => {
            // Arrange, Act
            await artistArtworkIndexer.refreshAllArtistsArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatHasNoTrackAsync(), Times.once());
            artistArtworkAdderMock.verify((x) => x.addMissingArtistArtworkAsync(), Times.once());
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.once());
        });
    });

    describe('refreshMissingArtistsArtworkAsync', () => {
        it('should show the indexing notification', async () => {
            // Arrange, Act
            await artistArtworkIndexer.refreshMissingArtistsArtworkAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.once());
        });

        it('should delete artist artwork from cache that have default cache id', async () => {
            // Arrange, Act
            await artistArtworkIndexer.refreshMissingArtistsArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkWithDefaultIdAsync(), Times.once());
        });

        it('should restart indexing artist artwork', async () => {
            // Arrange, Act
            await artistArtworkIndexer.refreshMissingArtistsArtworkAsync();

            // Assert
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatHasNoTrackAsync(), Times.once());
            artistArtworkAdderMock.verify((x) => x.addMissingArtistArtworkAsync(), Times.once());
            artistArtworkRemoverMock.verify((x) => x.removeArtistArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.once());
        });
    });
});
