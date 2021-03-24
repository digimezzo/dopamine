import { Pipe, PipeTransform } from '@angular/core';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatAlbumArtists' })
export class FormatAlbumArtistsPipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(albumArtists: string[], trackArtists: string[]): string {
        if (albumArtists != undefined && albumArtists.length > 0) {
            return albumArtists[0];
        }

        if (trackArtists != undefined && trackArtists.length > 0) {
            return trackArtists[0];
        }

        return this.translatorService.get('Album.UnknownArtist');
    }
}
