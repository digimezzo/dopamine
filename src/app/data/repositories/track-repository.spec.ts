import Database from 'better-sqlite3';
import { DatabaseFactory } from '../database-factory';
import { TrackRepositoryBase } from './track-repository.base';
import { ArtistData } from '../entities/artist-data';
import { TrackRepository } from './track-repository';

describe('TrackRepository', () => {
    let database: Database;
    let repository: TrackRepositoryBase;

    function setupDatabase(): void {
        const createTrackTable = database.prepare(
            `CREATE TABLE Track (
                TrackID     INTEGER,
                Artists     TEXT,
                ArtistsKey  TEXT,
                PRIMARY KEY(TrackID)
            );`,
        );

        createTrackTable.run();
    }

    function fillTestData(): void {
        const statement = database.prepare('INSERT INTO Track (Artists, ArtistsKey) VALUES (?, ?);');
        statement.run(';Metallica;', ';metallica;');
        statement.run(';Aerosmith;', ';aerosmith;');
        statement.run(';Metallica Feat. Aerosmith;', ';metallica;;aerosmith;');
        statement.run(';Alanis Morissette;', ';alanis morissette;');
        statement.run(';Aerosmith ft. Alanis Morissette;', ';aerosmith;;alanis morissette;');
    }

    beforeEach(() => {
        database = new Database(':memory:');
        const dummyFactory: DatabaseFactory = {
            create: (): any => database,
        } as DatabaseFactory;

        repository = new TrackRepository(dummyFactory);

        setupDatabase();
        fillTestData();
    });

    afterEach(() => {
        database.close();
    });

    describe('getArtistsWithoutArtistsKey', () => {
        it('should return all artist data that have no ArtistsKey', () => {
            // Arrange
            const statement = database.prepare('INSERT INTO Track (Artists) VALUES (?);');
            statement.run(';Apocalyptica;');

            // Act
            const artistData: ArtistData[] | undefined = repository.getArtistsWithoutArtistsKey();

            // Assert
            expect(artistData).not.toBeUndefined();
            expect(artistData!.length).toEqual(1);
            expect(artistData![0].artists).toEqual(';Apocalyptica;');
        });
    });

    describe('updateArtistsKey', () => {
        it('should set a new ArtistsKey for tracks with the corresponding artist', () => {
            // Arrange, Act
            repository.updateArtistsKey(';Metallica;', ';new-key;');

            // Assert
            const statement = database.prepare('SELECT ArtistsKey FROM Track WHERE Artists=?;');
            const key: string = statement.get(';Metallica;').ArtistsKey;

            expect(key).toEqual(';new-key;');
        });
    });

    describe('getAllIndividualArtists', () => {
        it('should return a list with all individual artists', () => {
            // Arrange, Act
            const artists: string[] | undefined = repository.getAllIndividualArtists();

            // Assert
            expect(artists).not.toBeUndefined();
            expect(artists!.length).toEqual(3);
            expect(artists!).toContain('metallica');
            expect(artists!).toContain('aerosmith');
            expect(artists!).toContain('alanis morissette');
        });
    });
});
