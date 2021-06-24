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
        throw new Error();
    });
});
