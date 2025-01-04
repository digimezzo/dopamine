import { Injectable } from '@angular/core';
import { SettingsBase } from '../../common/settings/settings.base';
import { ArtistModel } from './artist-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { StringUtils } from '../../common/utils/string-utils';
import { CollectionUtils } from '../../common/utils/collections-utils';

@Injectable({ providedIn: 'root' })
export class ArtistSplitter {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private settings: SettingsBase,
    ) {}

    public splitArtists(artists: string[]): ArtistModel[] {
        const separators: string[] = CollectionUtils.fromString(this.settings.artistSplitSeparators);
        const exceptions: string[] = CollectionUtils.fromString(this.settings.artistSplitExceptions);

        const returnArtists: ArtistModel[] = [];
        const uniqueArtistNames: Set<string> = new Set();

        for (const artist of artists) {
            if (separators.length > 0) {
                const splitArtists = this.splitArtist(artist, separators, exceptions);
                for (const splitArtist of splitArtists) {
                    if (!uniqueArtistNames.has(splitArtist.name.toLowerCase())) {
                        uniqueArtistNames.add(splitArtist.name.toLowerCase());
                        returnArtists.push(splitArtist);
                    }
                }
            } else {
                if (!uniqueArtistNames.has(artist.toLowerCase())) {
                    uniqueArtistNames.add(artist.toLowerCase());
                    returnArtists.push(new ArtistModel(artist, this.translatorService));
                }
            }
        }

        return returnArtists;
    }

    private splitArtist(artist: string, separators: string[], exceptions: string[]): ArtistModel[] {
        const artists: ArtistModel[] = [];

        for (const exception of exceptions) {
            if (StringUtils.includesIgnoreCase(artist, exception)) {
                artists.push(new ArtistModel(exception, this.translatorService));
                const escapedException = exception.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regEx: RegExp = new RegExp(escapedException, 'ig');
                artist = artist.replace(regEx, '¨');
            }
        }

        // Also adds a space before and after the separator
        const escapedSeparators = separators.map((separator) => ` ${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} `);
        const regex: RegExp = new RegExp(escapedSeparators.join('|'), 'i');
        artists.push(...artist.split(regex).map((a: string) => new ArtistModel(a.trim(), this.translatorService)));

        return artists.filter((a: ArtistModel): boolean => a.name !== '¨');
    }
}
