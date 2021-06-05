import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../core/strings';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatTrackTitle' })
export class FormatTrackTitlePipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(trackTitle: string, trackFileName: string): string {
        if (!Strings.isNullOrWhiteSpace(trackTitle)) {
            return trackTitle;
        }

        if (!Strings.isNullOrWhiteSpace(trackFileName)) {
            return trackFileName;
        }

        return this.translatorService.get('Track.UnknownTitle');
    }
}
