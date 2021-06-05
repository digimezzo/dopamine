export class ClauseCreator {
    private static escapeQuotes(source: string): string {
        return source.replace("'", "''");
    }

    public static createInClause(columnName: string, clauseItems: string[]): string {
        const quotedClauseItems: string[] = clauseItems.map((item) => "'" + ClauseCreator.escapeQuotes(item) + "'");
        const commaSeparatedItems: string = quotedClauseItems.join(',');

        return `${columnName} IN (${commaSeparatedItems})`;
    }
}
