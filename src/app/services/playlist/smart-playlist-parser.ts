import { Injectable } from '@angular/core';
import { FileAccessBase } from '../../common/io/file-access.base';
import { XMLParser } from 'fast-xml-parser';

export interface SmartPlaylistRule {
    field: string;
    operator: string;
    value: string;
}

export interface SmartPlaylistDefinition {
    name: string;
    match: 'any' | 'all';
    limitType: string | undefined;
    limitValue: number | undefined;
    rules: SmartPlaylistRule[];
}

@Injectable()
export class SmartPlaylistParser {
    public constructor(private fileAccess: FileAccessBase) {}

    public parse(playlistPath: string): SmartPlaylistDefinition {
        const content: string = this.fileAccess.getFileContentAsString(playlistPath);
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
        const parsed = parser.parse(content) as Record<string, unknown>;
        const smartPlaylist = parsed['smartplaylist'] as Record<string, unknown>;

        const name = String(smartPlaylist['name'] ?? '');
        const match = String(smartPlaylist['match'] ?? 'all') === 'any' ? 'any' : 'all';

        let limitType: string | undefined;
        let limitValue: number | undefined;

        const limit = smartPlaylist['limit'] as Record<string, unknown> | undefined;
        if (limit != undefined) {
            limitType = String(limit['@_type'] ?? 'songs');
            limitValue = Number(limit['#text'] ?? 0);
        }

        const rules: SmartPlaylistRule[] = [];
        const ruleEntries = smartPlaylist['rule'];

        if (ruleEntries != undefined) {
            const ruleArray = Array.isArray(ruleEntries)
                ? (ruleEntries as Record<string, unknown>[])
                : [ruleEntries as Record<string, unknown>];

            for (const rule of ruleArray) {
                rules.push({
                    field: String(rule['@_field'] ?? ''),
                    operator: String(rule['@_operator'] ?? ''),
                    value: String(rule['#text'] ?? ''),
                });
            }
        }

        return { name, match, limitType, limitValue, rules };
    }
}
