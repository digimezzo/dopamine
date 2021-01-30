import { Pipe, PipeTransform } from '@angular/core';
import { StringCompare } from '../core/string-compare';

@Pipe({ name: 'formatTrackTitle' })
export class FormatTrackTitlePipe implements PipeTransform {
    constructor() {}

    public transform(trackTitle: string, trackFileName: string): string {
        if (StringCompare.isNullOrWhiteSpace(trackTitle)) {
            return trackFileName;
        }

        return trackTitle;
    }
}
