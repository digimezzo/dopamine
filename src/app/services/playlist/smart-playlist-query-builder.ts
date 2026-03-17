import { Injectable } from '@angular/core';
import { SmartPlaylistDefinition, SmartPlaylistRule } from './smart-playlist-parser';
import { Constants } from '../../common/application/constants';
import { ClauseCreator } from '../../data/clause-creator';

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
        rating: 't.NewRating',
        love: 't.Love',
        playcount: 't.PlayCount',
        skipcount: 't.SkipCount',
    };

    private readonly delimitedFields: Set<string> = new Set(['artist', 'albumartist', 'genre']);

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
        const escapedValue = ClauseCreator.escapeQuotes(rule.value);

        switch (rule.operator) {
            case 'is':
                if (isDelimited) {
                    return this.buildDelimitedEquals(column, escapedValue);
                }
                return `${column} = '${escapedValue}'`;

            case 'isnot':
                if (isDelimited) {
                    return `NOT ${this.buildDelimitedEquals(column, escapedValue)}`;
                }
                return `${column} != '${escapedValue}'`;

            case 'contains':
                return `LOWER(${column}) LIKE LOWER('%${escapedValue}%')`;

            case 'doesnotcontain':
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
        return `LOWER(${column}) LIKE LOWER('%${delimiter}${escapedValue}${delimiter}%')`;
    }

    private toNumber(value: string): number {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 0 : parsed;
    }
}
