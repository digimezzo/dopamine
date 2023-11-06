import { StringUtils } from '../common/utils/string-utils';

export class ClauseCreator {
    public static escapeQuotes(sourceString: string): string {
        return StringUtils.replaceAll(sourceString, `'`, `''`);
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
            if (StringUtils.isNullOrWhiteSpace(clauseItem)) {
                orClauses.push(`(${columnName} IS NULL OR ${columnName}='')`);
            } else {
                orClauses.push(
                    `(LOWER(${columnName}) LIKE LOWER('%${delimiter}${StringUtils.replaceAll(clauseItem, `'`, `''`)}${delimiter}%'))`,
                );
            }
        }

        orLikeClause += orClauses.join(' OR ');
        orLikeClause += ')';

        return orLikeClause;
    }
}
