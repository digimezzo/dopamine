import { Pipe, PipeTransform } from '@angular/core';
import { StringCompare } from '../core/string-compare';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatTrackTitle' })
export class FormatTrackTitlePipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(trackTitle: string, trackFileName: string): string {
        if (!StringCompare.isNullOrWhiteSpace(trackTitle)) {
            return trackTitle;
        }

        if (!StringCompare.isNullOrWhiteSpace(trackFileName)) {
            return trackFileName;
        }

        return this.translatorService.get('Track.UnknownTitle');
    }
}
