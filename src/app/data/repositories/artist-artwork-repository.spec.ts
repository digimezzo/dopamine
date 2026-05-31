import Database from 'better-sqlite3';
import { ArtistArtworkRepository } from './artist-artwork-repository';
import { ArtistArtworkRepositoryBase } from './artist-artwork-repository.base';
import { DatabaseFactory } from '../database-factory';
import { ArtistArtwork } from '../entities/artist-artwork';
import { ArtistArtworkCacheId } from '../../services/artist-artwork-cache/artist-artwork-cache-id';

describe('ArtistArtworkRepository', () => {
    let database: Database;
    let repository: ArtistArtworkRepositoryBase;

    function setupDatabase(): void {
        const createArtistArtowrkTable = database.prepare(
            `CREATE TABLE ArtistArtwork (
                    ArtistArtworkID	    INTEGER,
                    Artist	            TEXT,
                    ArtworkID	        TEXT,
                    PRIMARY KEY(ArtistArtworkID)
            );`,
        );

        const createTrackTable = database.prepare(
            `CREATE TABLE Track (
                TrackID     INTEGER,
                ArtistsKey  TEXT,
                PRIMARY KEY(TrackID)
            );`,
        );

        createArtistArtowrkTable.run();
        createTrackTable.run();
    }

    function fillTestData(): void {
        const statement = database.prepare('INSERT INTO ArtistArtwork (Artist, ArtworkID) VALUES (?, ?);');
        statement.run('metallica', 'artist-1');
        statement.run('aerosmith', 'artist-2');
        statement.run('alanis morissette', 'artist-3');
    }

    beforeEach(() => {
        database = new Database(':memory:');
        const dummyFactory: DatabaseFactory = {
            create: (): any => database,
        } as DatabaseFactory;

        repository = new ArtistArtworkRepository(dummyFactory);

        setupDatabase();
        fillTestData();
    });

    afterEach(() => {
        database.close();
    });

    describe('addArtistArtwork', () => {
        it('should add an artist and the corresponding artworkId to the database', () => {
            // Arrange, Act
            const artistArtwork: ArtistArtwork = new ArtistArtwork('apocalyptica', 'artist-4');
            repository.addArtistArtwork(artistArtwork);

            // Assert
            const allArtwork: ArtistArtwork[] | undefined = repository.getAllArtistArtwork();
            expect(allArtwork).not.toBeUndefined();
            expect(allArtwork!.length).toEqual(4);
            expect(allArtwork).toContainEqual(
                expect.objectContaining({
                    artist: 'apocalyptica',
                    artworkId: 'artist-4',
                }),
            );
        });
    });

    describe('getAllArtistArtwork', () => {
        it('should return all entries in the table', () => {
            // Arrange, Act
            const allArtwork: ArtistArtwork[] | undefined = repository.getAllArtistArtwork();

            // Assert
            expect(allArtwork).not.toBeUndefined();
            expect(allArtwork!.length).toEqual(3);
        });
    });

    describe('getArtistArtworkForArtist', () => {
        it('should return the artwork for a specific artist', () => {
            // Arrange, Act
            const artwork: ArtistArtwork | undefined = repository.getArtistArtworkForArtist('Metallica');

            // Assert
            expect(artwork).not.toBeUndefined();
            expect(artwork!.artist).toEqual('metallica');
            expect(artwork!.artworkId).toEqual('artist-1');
        });
    });

    describe('getNumberOfArtistArtwork', () => {
        it('should return the number of all artist artwork', () => {
            // Arrange, Act
            const count: number = repository.getNumberOfArtistArtwork();

            // Assert
            expect(count).toEqual(3);
        });
    });

    describe('getNumberOfArtistArtworkThatHasNoTrack', () => {
        it('should return the number of artist artwork where the artist does not appear in the ArtistsKey of any track', () => {
            // Arrange, Act
            const count: number = repository.getNumberOfArtistArtworkThatHasNoTrack();

            // Assert
            expect(count).toEqual(3);
        });

        it('should return 0 if all artists are part of a track', () => {
            // Arrange
            const statement = database.prepare('INSERT INTO Track (ArtistsKey) VALUES (?);');
            statement.run(';metallica;');
            statement.run(';aerosmith;;alanis morissette;');

            // Act
            const count: number = repository.getNumberOfArtistArtworkThatHasNoTrack();

            // Assert
            expect(count).toEqual(0);
        });
    });

    describe('deleteArtistArtworkThatHasNoTrack', () => {
        it('should delete all artist artwork where the artist does not appear in the ArtistsKey of any track', () => {
            // Arrange, Act
            const deletedRows: number = repository.deleteArtistArtworkThatHasNoTrack();

            // Assert
            expect(deletedRows).toEqual(3);
            expect(repository.getNumberOfArtistArtwork()).toEqual(0);
        });

        it('should not delete any row if all artists are part of a track', () => {
            // Arrange
            const statement = database.prepare('INSERT INTO Track (ArtistsKey) VALUES (?);');
            statement.run(';metallica;');
            statement.run(';aerosmith;;alanis morissette;');

            // Act
            const deletedRows: number = repository.deleteArtistArtworkThatHasNoTrack();

            // Assert
            expect(deletedRows).toEqual(0);
        });
    });

    describe('deleteAllArtistArtwork', () => {
        it('should delete all artist artwork', () => {
            // Arrange, Act
            const deletedRows: number = repository.deleteAllArtistArtwork();

            // Assert
            expect(deletedRows).toEqual(3);
            expect(repository.getNumberOfArtistArtwork()).toEqual(0);
        });
    });

    describe('deleteArtistArtworkWithDefaultId', () => {
        it('should delete artist artwork that have a default-id', () => {
            // Arrange
            repository.addArtistArtwork(new ArtistArtwork('apocalyptica', ArtistArtworkCacheId.defaultArtworkId));
            expect(repository.getNumberOfArtistArtwork()).toEqual(4);

            // Act
            const deletedRows: number = repository.deleteArtistArtworkWithDefaultId();

            // Assert
            expect(deletedRows).toEqual(1);
            expect(repository.getNumberOfArtistArtwork()).toEqual(3);
        });
    });
});
