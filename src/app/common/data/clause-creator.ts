import { Strings } from '../strings';

export class ClauseCreator {
    public static escapeQuotes(sourceString: string): string {
        return Strings.replaceAll(sourceString, `'`, `''`);
    }

    public static createTextInClause(columnName: string, clauseItems: string[]): string {
        const quotedClauseItems: string[] = clauseItems.map((item) => `'` + ClauseCreator.escapeQuotes(item) + `'`);
        const commaSeparatedItems: string = quotedClauseItems.join(',');

        return `${columnName} IN (${commaSeparatedItems})`;
    }

    public static createNumericInClause(columnName: string, clauseItems: number[]): string {
        const commaSeparatedItems: string = clauseItems.join(',');

        return `${columnName} IN (${commaSeparatedItems})`;
    }

    public static createOrLikeClause(columnName: string, clauseItems: string[], delimiter: string): string {
        let orLikeClause: string = '';

        orLikeClause += ' (';

        const orClauses: string[] = [];

        for (const clauseItem of clauseItems) {
            if (Strings.isNullOrWhiteSpace(clauseItem)) {
                orClauses.push(`(${columnName} IS NULL OR ${columnName}='')`);
            } else {
                orClauses.push(
                    `(LOWER(${columnName}) LIKE LOWER('%${delimiter}${Strings.replaceAll(clauseItem, `'`, `''`)}${delimiter}%'))`
                );
            }
        }

        orLikeClause += orClauses.join(' OR ');
        orLikeClause += ')';

        return orLikeClause;
    }
}
