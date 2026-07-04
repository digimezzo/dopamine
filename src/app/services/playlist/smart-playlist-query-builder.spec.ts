import { SmartPlaylistDefinition } from './smart-playlist-parser';
import { SmartPlaylistQueryBuilder } from './smart-playlist-query-builder';

describe('SmartPlaylistQueryBuilder', () => {
    let queryBuilder: SmartPlaylistQueryBuilder;

    beforeEach(() => {
        queryBuilder = new SmartPlaylistQueryBuilder();
    });

    describe('buildWhereClause', () => {
        it('should build accent-insensitive clause for contains on string fields', () => {
            // Arrange
            const definition: SmartPlaylistDefinition = {
                name: 'test',
                match: 'all',
                limitType: undefined,
                limitValue: undefined,
                rules: [{ field: 'artist', operator: 'contains', value: 'nono' }],
            };

            // Act
            const whereClause: string = queryBuilder.buildWhereClause(definition);

            // Assert
            expect(whereClause).toContain('LOWER(t.Artists)');
            expect(whereClause).toContain("'ô', 'o'");
            expect(whereClause).toContain("LIKE '%nono%'");
        });

        it('should normalize accents in filter values for contains', () => {
            // Arrange
            const definition: SmartPlaylistDefinition = {
                name: 'test',
                match: 'all',
                limitType: undefined,
                limitValue: undefined,
                rules: [{ field: 'artist', operator: 'contains', value: 'nonô' }],
            };

            // Act
            const whereClause: string = queryBuilder.buildWhereClause(definition);

            // Assert
            expect(whereClause).toContain("LIKE '%nono%'");
        });

        it('should build accent-insensitive clause for delimited equals', () => {
            // Arrange
            const definition: SmartPlaylistDefinition = {
                name: 'test',
                match: 'all',
                limitType: undefined,
                limitValue: undefined,
                rules: [{ field: 'genre', operator: 'is', value: 'Rôck' }],
            };

            // Act
            const whereClause: string = queryBuilder.buildWhereClause(definition);

            // Assert
            expect(whereClause).toContain('LOWER(t.Genres)');
            expect(whereClause).toContain("'ô', 'o'");
            expect(whereClause).toContain("LIKE '%;rock;%'");
        });

        it('should build numeric clause for bpm with greaterthan', () => {
            // Arrange
            const definition: SmartPlaylistDefinition = {
                name: 'test',
                match: 'all',
                limitType: undefined,
                limitValue: undefined,
                rules: [{ field: 'bpm', operator: 'greaterthan', value: '120' }],
            };

            // Act
            const whereClause: string = queryBuilder.buildWhereClause(definition);

            // Assert
            expect(whereClause).toContain('(t.BeatsPerMinute > 120)');
        });

        it('should build numeric clause for bpm with is operator', () => {
            // Arrange
            const definition: SmartPlaylistDefinition = {
                name: 'test',
                match: 'all',
                limitType: undefined,
                limitValue: undefined,
                rules: [{ field: 'bpm', operator: 'is', value: '5' }],
            };

            // Act
            const whereClause: string = queryBuilder.buildWhereClause(definition);

            // Assert
            expect(whereClause).toContain('(t.BeatsPerMinute = 5)');
        });

        it('should build numeric clause for bpm with isnot operator', () => {
            // Arrange
            const definition: SmartPlaylistDefinition = {
                name: 'test',
                match: 'all',
                limitType: undefined,
                limitValue: undefined,
                rules: [{ field: 'bpm', operator: 'isnot', value: '5' }],
            };

            // Act
            const whereClause: string = queryBuilder.buildWhereClause(definition);

            // Assert
            expect(whereClause).toContain('(t.BeatsPerMinute != 5)');
        });
    });
});
