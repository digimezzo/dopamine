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
                const escapedException = exception.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regEx: RegExp = new RegExp(escapedException, 'ig');
                artist = artist.replace(regEx, '¨');
            }
        }

        const escapedSeparators = separators.map((separator) => separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex: RegExp = new RegExp(escapedSeparators.join('|'), 'i');
        artists.push(...artist.split(regex).map((a: string) => new ArtistModel(originalArtist, a.trim(), this.translatorService)));

        return artists.filter((a: ArtistModel): boolean => a.name !== '¨');
    }
}
