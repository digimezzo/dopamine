import { Injectable } from '@angular/core';
import { SettingsBase } from '../../common/settings/settings.base';
import { ArtistModel } from './artist-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';

@Injectable({ providedIn: 'root' })
export class ArtistSplitter {
    private separators: string[] = this.settings.artistSplitSeparators.split(';').filter((x: string): boolean => x !== '');
    private exceptions: string[] = this.settings.artistSplitExceptions.split(';').filter((x: string): boolean => x !== '');

    public constructor(
        private translatorService: TranslatorServiceBase,
        private settings: SettingsBase,
    ) {}

    public splitArtist(artist: string): ArtistModel[] {
        const artists: ArtistModel[] = [];

        if (this.separators.length > 0) {
            const originalArtist: string = artist;

            for (const exception of this.exceptions) {
                if (artist.includes(exception)) {
                    artists.push(new ArtistModel(originalArtist, exception, this.translatorService));
                }

                artist = artist.replace(exception, '');
            }

            const regex: RegExp = new RegExp(this.separators.join('|'), 'i');
            artists.push(...artist.split(regex).map((a: string) => new ArtistModel(originalArtist, a.trim(), this.translatorService)));
        } else {
            artists.push(new ArtistModel(artist, artist, this.translatorService));
        }

        return artists.filter((artist: ArtistModel): boolean => artist.name !== '');
    }
}
