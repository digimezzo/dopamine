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
        const separators: string[] =
            this.settings.artistSplitSeparators.trim().length > 0 ? this.settings.artistSplitSeparators.split(';') : [];
        const exceptions: string[] =
            this.settings.artistSplitExceptions.trim().length > 0 ? this.settings.artistSplitExceptions.split(';') : [];

        const returnArtists: ArtistModel[] = [];

        if (separators.length > 0) {
            for (const artist of artists) {
                const splitArtists: ArtistModel[] = this.splitArtist(artist, separators, exceptions);
                for (const splitArtist of splitArtists) {
                    if (
                        CollectionUtils.includesIgnoreCase(
                            returnArtists.map((x) => x.displayName),
                            splitArtist.displayName,
                        )
                    ) {
                        returnArtists
                            .find((x) => StringUtils.equalsIgnoreCase(x.displayName, splitArtist.displayName))
                            ?.sourceNames.push(splitArtist.sourceNames[0]);
                    } else {
                        returnArtists.push(splitArtist);
                    }
                }
            }
        } else {
            returnArtists.push(...artists.map((a: string) => new ArtistModel(a, a, this.translatorService)));
        }

        return returnArtists;
    }

    private splitArtist(artist: string, separators: string[], exceptions: string[]): ArtistModel[] {
        const originalArtist: string = artist;
        const artists: ArtistModel[] = [];

        for (const exception of exceptions) {
            if (artist.includes(exception)) {
                artists.push(new ArtistModel(originalArtist, exception, this.translatorService));
                artist = artist.replace(exception, '20384fb2-2042-4779-8fcf-7f24f3807314');
            }
        }

        const regex: RegExp = new RegExp(separators.join('|'), 'i');
        artists.push(...artist.split(regex).map((a: string) => new ArtistModel(originalArtist, a.trim(), this.translatorService)));

        return artists.filter((a: ArtistModel): boolean => a.name !== '20384fb2-2042-4779-8fcf-7f24f3807314');
    }
}
