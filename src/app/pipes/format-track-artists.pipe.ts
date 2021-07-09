import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../common/strings';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatTrackArtists' })
export class FormatTrackArtistsPipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(trackArtists: string[]): string {
        if (trackArtists == undefined || trackArtists.length === 0) {
            return this.translatorService.get('unknown-artist');
        }

        const commaSeparatedArtists: string = trackArtists.filter((x) => !Strings.isNullOrWhiteSpace(x)).join(', ');

        if (commaSeparatedArtists.length === 0) {
            return this.translatorService.get('unknown-artist');
        }

        return commaSeparatedArtists;
    }
}
