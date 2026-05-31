import { Injectable } from '@angular/core';
import { SettingsBase } from '../../common/settings/settings.base';
import { StringUtils } from '../../common/utils/string-utils';
import { CollectionUtils } from '../../common/utils/collections-utils';

@Injectable({ providedIn: 'root' })
export class ArtistSplitter {
    public constructor(
        private settings: SettingsBase,
    ) {}

    public splitArtists(artists: string[]): string[] {
        const separators: string[] = CollectionUtils.fromString(this.settings.artistSplitSeparators);
        const exceptions: string[] = CollectionUtils.fromString(this.settings.artistSplitExceptions);

        const returnArtists: string[] = [];
        const uniqueArtistNames: Set<string> = new Set();

        for (const artist of artists) {
            if (separators.length > 0) {
                const splitArtists: string[] = this.splitArtist(artist, separators, exceptions);
                for (const splitArtist of splitArtists) {
                    if (!uniqueArtistNames.has(splitArtist.toLowerCase())) {
                        uniqueArtistNames.add(splitArtist.toLowerCase());
                        returnArtists.push(splitArtist);
                    }
                }
            } else {
                if (!uniqueArtistNames.has(artist.toLowerCase())) {
                    uniqueArtistNames.add(artist.toLowerCase());
                    returnArtists.push(artist);
                }
            }
        }

        return returnArtists;
    }

    private splitArtist(artist: string, separators: string[], exceptions: string[]): string[] {
        const artists: string[] = [];

        for (const exception of exceptions) {
            if (StringUtils.includesIgnoreCase(artist, exception)) {
                artists.push(exception);
                const escapedException = this.escaped(exception);
                const regEx: RegExp = new RegExp(escapedException, 'ig');
                artist = artist.replace(regEx, '¨');
            }
        }

        // Also adds a space before and after the separator
        const escapedSeparators = separators.map((separator) => ` ${this.escaped(separator)} `);
        const regex: RegExp = new RegExp(escapedSeparators.join('|'), 'i');
        artists.push(...artist.split(regex));

        return artists.filter((name: string): boolean => name !== '¨');
    }

    private escaped(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
