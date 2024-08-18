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

        for (const artist of artists) {
            if (separators.length > 0) {
                const splitArtists: ArtistModel[] = this.splitArtist(artist, separators, exceptions);
                for (const splitArtist of splitArtists) {
                    if (
                        CollectionUtils.includesIgnoreCase(
                            returnArtists.map((x) => x.displayName),
                            splitArtist.displayName,
                        )
                    ) {
                        const returnArtist: ArtistModel | undefined = returnArtists.find((x) =>
                            StringUtils.equalsIgnoreCase(x.displayName, splitArtist.displayName),
                        );

                        if (returnArtist && !CollectionUtils.includesIgnoreCase(returnArtist.sourceNames, splitArtist.sourceNames[0])) {
                            returnArtist.sourceNames.push(splitArtist.sourceNames[0]);
                        }
                    } else {
                        returnArtists.push(splitArtist);
                    }
                }
            } else {
                if (
                    !CollectionUtils.includesIgnoreCase(
                        returnArtists.map((x) => x.displayName),
                        artist,
                    )
                ) {
                    returnArtists.push(new ArtistModel(artist, artist, this.translatorService));
                }
            }
        }

        return returnArtists;
    }

    private splitArtist(artist: string, separators: string[], exceptions: string[]): ArtistModel[] {
        const originalArtist: string = artist;
        const artists: ArtistModel[] = [];

        for (const exception of exceptions) {
            if (StringUtils.includesIgnoreCase(artist, exception)) {
                artists.push(new ArtistModel(originalArtist, exception, this.translatorService));
                const regEx: RegExp = new RegExp(exception, 'ig');
                artist = artist.replace(regEx, '20384fb2-2042-4779-8fcf-7f24f3807314');
            }
        }

        const regex: RegExp = new RegExp(separators.join('|'), 'i');
        artists.push(...artist.split(regex).map((a: string) => new ArtistModel(originalArtist, a.trim(), this.translatorService)));

        return artists.filter((a: ArtistModel): boolean => a.name !== '20384fb2-2042-4779-8fcf-7f24f3807314');
    }
}
