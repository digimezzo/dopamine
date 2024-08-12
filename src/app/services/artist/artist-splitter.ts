import { Injectable } from '@angular/core';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable({ providedIn: 'root' })
export class ArtistSplitter {
    private separators: string[] = this.settings.artistSplitSeparators.split(';');
    private exceptions: string[] = this.settings.artistSplitExceptions.split(';');

    public constructor(private settings: SettingsBase) {}

    public splitArtist(artist: string): string[] {
        const artists: string[] = [];

        for (const exception of this.exceptions) {
            if (artist.includes(exception)) {
                artists.push(exception);
            }

            artist = artist.replace(exception, '');
        }

        const regex = new RegExp(this.separators.join('|'), 'i');
        artists.push(...artist.split(regex).map((a) => a.trim()));

        return artists.filter((artist) => artist !== '');
    }
}
