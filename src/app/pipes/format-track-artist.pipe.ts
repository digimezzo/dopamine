import { Pipe, PipeTransform } from '@angular/core';
import { StringCompare } from '../core/string-compare';
import { TranslatorService } from '../services/translator/translator.service';

@Pipe({ name: 'formatTrackArtists' })
export class FormatTrackArtistsPipe implements PipeTransform {
    constructor(private translatorService: TranslatorService) {}

    public transform(trackArtists: string[]): string {
        if (trackArtists == undefined || trackArtists.length === 0) {
            return this.translatorService.get('Track.UnknownArtist');
        }

        const commaSeparatedArtists: string = trackArtists.filter((x) => !StringCompare.isNullOrWhiteSpace(x)).join(', ');

        if (commaSeparatedArtists.length === 0) {
            return this.translatorService.get('Track.UnknownArtist');
        }

        return commaSeparatedArtists;
    }
}
