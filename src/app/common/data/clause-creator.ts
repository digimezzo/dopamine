import { Strings } from '../strings';

export class ClauseCreator {
    public static escapeQuotes(sourceString: string): string {
        return Strings.replaceAll(sourceString, `'`, `''`);
    }

    public static createInClause(columnName: string, clauseItems: string[]): string {
        const quotedClauseItems: string[] = clauseItems.map((item) => `'` + ClauseCreator.escapeQuotes(item) + `'`);
        const commaSeparatedItems: string = quotedClauseItems.join(',');

        return `${columnName} IN (${commaSeparatedItems})`;
    }
}
