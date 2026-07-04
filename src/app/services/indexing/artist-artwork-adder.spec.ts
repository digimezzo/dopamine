import { IMock, It, Mock, Times } from 'typemoq';
import { GuidFactory } from '../../common/guid.factory';
import { Logger } from '../../common/logger';
import { ArtistArtworkCacheId } from '../artist-artwork-cache/artist-artwork-cache-id';
import { ArtistArtworkAdder } from './artist-artwork-adder';
import { ArtistArtworkCacheServiceBase } from '../artist-artwork-cache/artist-artwork-cache.service.base';
import { ArtistArtworkRepositoryBase } from '../../data/repositories/artist-artwork-repository.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ArtistArtwork } from '../../data/entities/artist-artwork';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { OnlineArtistArtworkGetter } from './online-artist-artwork-getter';

const artistArtworkData: Buffer = Buffer.from([1, 2, 3]);

describe('ArtistArtworkAdder', () => {
    let artistArtworkCacheServiceMock: IMock<ArtistArtworkCacheServiceBase>;
    let artistArtworkRepositoryMock: IMock<ArtistArtworkRepositoryBase>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let loggerMock: IMock<Logger>;
    let artistArtworkGetterMock: IMock<OnlineArtistArtworkGetter>;
    let guidFactoryMock: IMock<GuidFactory>;

    let artistArtworkAdder: ArtistArtworkAdder;

    beforeEach(() => {
        artistArtworkCacheServiceMock = Mock.ofType<ArtistArtworkCacheServiceBase>();
        artistArtworkRepositoryMock = Mock.ofType<ArtistArtworkRepositoryBase>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        loggerMock = Mock.ofType<Logger>();
        artistArtworkGetterMock = Mock.ofType<OnlineArtistArtworkGetter>();
        guidFactoryMock = Mock.ofType<GuidFactory>();

        artistArtworkAdder = new ArtistArtworkAdder(
            artistArtworkCacheServiceMock.object,
            artistArtworkRepositoryMock.object,
            trackRepositoryMock.object,
            notificationServiceMock.object,
            loggerMock.object,
            artistArtworkGetterMock.object,
        );
    });

    describe('addMissingArtistArtworkAsync', () => {
        it('should find artists that have no artwork', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1', 'artist2', 'artist3']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => [new ArtistArtwork('artist1', 'artwork1'), new ArtistArtwork('artist3', 'artwork3')]);

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkGetterMock.verify((x) => x.getOnlineArtworkAsync('artist1'), Times.never());
            artistArtworkGetterMock.verify((x) => x.getOnlineArtworkAsync('artist2'), Times.exactly(1));
            artistArtworkGetterMock.verify((x) => x.getOnlineArtworkAsync('artist3'), Times.never());
        });

        it('should do nothing if there is no artist without artwork', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1', 'artist2', 'artist3']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => [
                    new ArtistArtwork('artist1', 'artwork1'),
                    new ArtistArtwork('artist2', 'artwork2'),
                    new ArtistArtwork('artist3', 'artwork3'),
                ]);

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkGetterMock.verify((x) => x.getOnlineArtworkAsync(It.isAnyString()), Times.never());
        });

        it('should notify that artist artwork is being updated if it is the first time that indexing runs', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            artistArtworkRepositoryMock.setup((x) => x.getNumberOfArtistArtwork()).returns(() => 0);

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that artist artwork is being updated if it is not the first time that indexing runs', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            artistArtworkRepositoryMock.setup((x) => x.getNumberOfArtistArtwork()).returns(() => 10);

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingArtistArtworkAsync(), Times.never());
        });

        it('should ignore unknown artists', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1', '']);
            artistArtworkRepositoryMock.setup((x) => x.getAllArtistArtwork()).returns(() => [new ArtistArtwork('artist1', 'artwork1')]);

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkGetterMock.verify((x) => x.getOnlineArtworkAsync(It.isAnyString()), Times.never());
        });

        it('should not add artist artwork to the cache if the artwork could not be loaded', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1', 'artist2', 'artist3']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            artistArtworkGetterMock.setup((x) => x.getOnlineArtworkAsync(It.isAnyString())).returns(() => Promise.resolve(undefined));

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkCacheServiceMock.verify((x) => x.addArtworkDataToCacheAsync(It.isAny()), Times.never());
        });

        it('should add artist artwork to the cache if artist artwork data was found', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            artistArtworkGetterMock
                .setup((x) => x.getOnlineArtworkAsync(It.isAnyString()))
                .returns(() => Promise.resolve(artistArtworkData));

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkCacheServiceMock.verify((x) => x.addArtworkDataToCacheAsync(artistArtworkData), Times.exactly(1));
        });

        it('should not add artist artwork to the database if the artwork was not added to the cache', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1', 'artist2', 'artist3']);
            artistArtworkRepositoryMock
                .setup((x) => x.getAllArtistArtwork())
                .returns(() => []);
            artistArtworkGetterMock
                .setup((x) => x.getOnlineArtworkAsync(It.isAnyString()))
                .returns(() => Promise.resolve(artistArtworkData));
            artistArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(artistArtworkData))
                .returns(() => Promise.resolve(undefined));

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.addArtistArtwork(It.isAny()), Times.never());
        });

        it('should add artist artwork to the database if the artwork was added to the cache', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllIndividualArtists()).returns(() => ['artist1']);
            artistArtworkRepositoryMock.setup((x) => x.getAllArtistArtwork()).returns(() => []);
            artistArtworkGetterMock
                .setup((x) => x.getOnlineArtworkAsync(It.isAnyString()))
                .returns(() => Promise.resolve(artistArtworkData));

            const artistArtworkCacheId: ArtistArtworkCacheId = new ArtistArtworkCacheId(guidFactoryMock.object);
            artistArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(artistArtworkData))
                .returns(() => Promise.resolve(artistArtworkCacheId));

            const newArtistArtwork: ArtistArtwork = new ArtistArtwork('artist1', artistArtworkCacheId.id);

            // Act
            await artistArtworkAdder.addMissingArtistArtworkAsync();

            // Assert
            artistArtworkRepositoryMock.verify((x) => x.addArtistArtwork(newArtistArtwork), Times.exactly(1));
        });
    });
});
