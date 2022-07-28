import { ClauseCreator } from './clause-creator';

describe('ClauseCreator', () => {
    describe('escapeQuotes', () => {
        it('should replace single quotes by double single quotes', () => {
            // Arrange
            const sourceString: string = `A string 'with' single 'quotes'`;

            // Act
            const returnString: string = ClauseCreator.escapeQuotes(sourceString);

            // Assert
            expect(returnString).toEqual(`A string ''with'' single ''quotes''`);
        });
    });

    describe('createInClause', () => {
        it('should create an in clause given a column name and clause items', () => {
            // Arrange
            const columnName: string = 'TheColumn';
            const clauseItems: string[] = ['Item1', 'Item2', 'Item3'];

            // Act
            const inClause: string = ClauseCreator.createInClause(columnName, clauseItems);

            // Assert
            expect(inClause).toEqual(`TheColumn IN ('Item1','Item2','Item3')`);
        });
    });

    describe('createOrLikeClause', () => {
        it('should create an or like clause given a column name and clause items and a delimiter', () => {
            // Arrange
            const columnName: string = 'TheColumn';
            const clauseItems: string[] = ['Item1', '', 'Item3'];
            const delimiter: string = ';';

            // Act
            const orLikeClause: string = ClauseCreator.createOrLikeClause(columnName, clauseItems, delimiter);

            // Assert
            expect(orLikeClause).toEqual(
                ` ((LOWER(TheColumn) LIKE LOWER('%;Item1;%')) OR (TheColumn IS NULL OR TheColumn='') OR (LOWER(TheColumn) LIKE LOWER('%;Item3;%')))`
            );
        });
    });
});
