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

    describe('createTextInClause', () => {
        it('should create an in clause given a column name and text clause items', () => {
            // Arrange
            const columnName: string = 'TheColumn';
            const clauseItems: string[] = ['Item1', 'Item2', 'Item3'];

            // Act
            const inClause: string = ClauseCreator.createTextInClause(columnName, clauseItems);

            // Assert
            expect(inClause).toEqual(`TheColumn IN ('Item1','Item2','Item3')`);
        });
    });

    describe('createNumericInClause', () => {
        it('should create an in clause given a column name and numeric clause items', () => {
            // Arrange
            const columnName: string = 'TheColumn';
            const clauseItems: number[] = [1, 5, 8];

            // Act
            const inClause: string = ClauseCreator.createNumericInClause(columnName, clauseItems);

            // Assert
            expect(inClause).toEqual(`TheColumn IN (1,5,8)`);
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
