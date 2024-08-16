import { Injectable } from '@angular/core';
import { SettingsBase } from '../../common/settings/settings.base';
import { ArtistModel } from './artist-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';

@Injectable({ providedIn: 'root' })
export class ArtistSplitter {
    private separators: string[] = this.settings.artistSplitSeparators.split(';');
    private exceptions: string[] = this.settings.artistSplitExceptions.split(';');

    public constructor(
        private translatorService: TranslatorServiceBase,
        private settings: SettingsBase,
    ) {}

    public splitArtists(artists: string[]): ArtistModel[] {
        const returnArtists: ArtistModel[] = [];

        for (const artist of artists) {
            const splitArtists: ArtistModel[] = this.splitArtist(artist);
            for (const splitArtist of splitArtists) {
                if (returnArtists.map((x) => x.displayName.toLowerCase()).includes(splitArtist.displayName.toLowerCase())) {
                    returnArtists
                        .find((x) => x.displayName.toLowerCase() === splitArtist.displayName.toLowerCase())
                        ?.sourceNames.push(splitArtist.sourceNames[0]);
                } else {
                    returnArtists.push(splitArtist);
                }
            }
        }

        return returnArtists;
    }

    private splitArtist(artist: string): ArtistModel[] {
        const originalArtist: string = artist;
        const artists: ArtistModel[] = [];

        for (const exception of this.exceptions) {
            if (artist.includes(exception)) {
                artists.push(new ArtistModel(originalArtist, exception, this.translatorService));
            }

            artist = artist.replace(exception, '');
        }

        const regex: RegExp = new RegExp(this.separators.join('|'), 'i');
        artists.push(...artist.split(regex).map((a: string) => new ArtistModel(originalArtist, a.trim(), this.translatorService)));

        return artists.filter((artist: ArtistModel): boolean => artist.name !== '');
    }
}
