import { Injectable } from '@angular/core';
import { SmartPlaylistDefinition, SmartPlaylistRule } from './smart-playlist-parser';
import { Constants } from '../../common/application/constants';
import { ClauseCreator } from '../../data/clause-creator';
import { StringUtils } from '../../common/utils/string-utils';

@Injectable()
export class SmartPlaylistQueryBuilder {
    private readonly fieldToColumn: Record<string, string> = {
        artist: 't.Artists',
        albumartist: 't.AlbumArtists',
        genre: 't.Genres',
        title: 't.TrackTitle',
        albumtitle: 't.AlbumTitle',
        bitrate: 't.BitRate',
        tracknumber: 't.TrackNumber',
        trackcount: 't.TrackCount',
        discnumber: 't.DiscNumber',
        disccount: 't.DiscCount',
        year: 't.Year',
        bpm: 't.BeatsPerMinute',
        rating: 't.NewRating',
        love: 't.Love',
        playcount: 't.PlayCount',
        skipcount: 't.SkipCount',
    };

    private readonly delimitedFields: Set<string> = new Set(['artist', 'albumartist', 'genre']);
    private readonly textFields: Set<string> = new Set(['artist', 'albumartist', 'genre', 'title', 'albumtitle']);
    private readonly numericFields: Set<string> = new Set([
        'bitrate',
        'tracknumber',
        'trackcount',
        'discnumber',
        'disccount',
        'year',
        'bpm',
        'rating',
        'playcount',
        'skipcount',
    ]);
    private readonly accentReplacements: Array<[string, string]> = [
        ['à', 'a'],
        ['á', 'a'],
        ['â', 'a'],
        ['ã', 'a'],
        ['ä', 'a'],
        ['å', 'a'],
        ['ç', 'c'],
        ['è', 'e'],
        ['é', 'e'],
        ['ê', 'e'],
        ['ë', 'e'],
        ['ì', 'i'],
        ['í', 'i'],
        ['î', 'i'],
        ['ï', 'i'],
        ['ñ', 'n'],
        ['ò', 'o'],
        ['ó', 'o'],
        ['ô', 'o'],
        ['õ', 'o'],
        ['ö', 'o'],
        ['ù', 'u'],
        ['ú', 'u'],
        ['û', 'u'],
        ['ü', 'u'],
        ['ý', 'y'],
        ['ÿ', 'y'],
    ];

    public buildWhereClause(definition: SmartPlaylistDefinition): string {
        if (definition.rules.length === 0) {
            return '';
        }

        const clauses: string[] = [];

        for (const rule of definition.rules) {
            const clause = this.buildRuleClause(rule);
            if (clause.length > 0) {
                clauses.push(clause);
            }
        }

        if (clauses.length === 0) {
            return '';
        }

        const joiner = definition.match === 'any' ? ' OR ' : ' AND ';
        let whereClause = `(${clauses.join(joiner)})`;

        if (definition.limitType === 'songs' && definition.limitValue != undefined && definition.limitValue > 0) {
            whereClause += ` LIMIT ${definition.limitValue}`;
        }

        return whereClause;
    }

    private buildRuleClause(rule: SmartPlaylistRule): string {
        const column = this.fieldToColumn[rule.field];

        if (column == undefined) {
            return '';
        }

        const isDelimited = this.delimitedFields.has(rule.field);
        const isTextField = this.textFields.has(rule.field);
        const isNumeric = this.numericFields.has(rule.field);
        const escapedValue = this.escapeRuleValue(rule.value, isTextField);

        switch (rule.operator) {
            case 'is':
                if (isDelimited) {
                    return this.buildDelimitedEquals(column, escapedValue);
                }
                if (isTextField) {
                    return `${this.buildAccentInsensitiveExpression(column)} = '${escapedValue}'`;
                }
                if (isNumeric) {
                    return `${column} = ${this.toNumber(rule.value)}`;
                }
                return `${column} = '${escapedValue}'`;

            case 'isnot':
                if (isDelimited) {
                    return `NOT ${this.buildDelimitedEquals(column, escapedValue)}`;
                }
                if (isTextField) {
                    return `${this.buildAccentInsensitiveExpression(column)} != '${escapedValue}'`;
                }
                if (isNumeric) {
                    return `${column} != ${this.toNumber(rule.value)}`;
                }
                return `${column} != '${escapedValue}'`;

            case 'contains':
                if (isTextField) {
                    return `${this.buildAccentInsensitiveExpression(column)} LIKE '%${escapedValue}%'`;
                }
                return `LOWER(${column}) LIKE LOWER('%${escapedValue}%')`;

            case 'doesnotcontain':
                if (isTextField) {
                    return `${this.buildAccentInsensitiveExpression(column)} NOT LIKE '%${escapedValue}%'`;
                }
                return `LOWER(${column}) NOT LIKE LOWER('%${escapedValue}%')`;

            case 'greaterthan':
                return `${column} > ${this.toNumber(rule.value)}`;

            case 'lessthan':
                return `${column} < ${this.toNumber(rule.value)}`;

            default:
                return '';
        }
    }

    private buildDelimitedEquals(column: string, escapedValue: string): string {
        const delimiter = Constants.columnValueDelimiter;
        return `${this.buildAccentInsensitiveExpression(column)} LIKE '%${delimiter}${escapedValue}${delimiter}%'`;
    }

    private escapeRuleValue(ruleValue: string, isTextField: boolean): string {
        if (!isTextField) {
            return ClauseCreator.escapeQuotes(ruleValue);
        }

        return ClauseCreator.escapeQuotes(StringUtils.removeAccents(ruleValue).toLowerCase());
    }

    private buildAccentInsensitiveExpression(column: string): string {
        let expression = `LOWER(${column})`;

        for (const replacement of this.accentReplacements) {
            expression = `REPLACE(${expression}, '${replacement[0]}', '${replacement[1]}')`;
        }

        return expression;
    }

    private toNumber(value: string): number {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
}
