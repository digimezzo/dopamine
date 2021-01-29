import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatTrackNumber' })
export class FormatTrackNumberPipe implements PipeTransform {
    constructor() {}

    public transform(trackNumber: number): string {
        if (trackNumber == undefined) {
            return '--';
        }

        if (trackNumber <= 0) {
            return '--';
        }

        if (trackNumber >= 1 && trackNumber <= 9) {
            return `0${trackNumber}`;
        }

        return `${trackNumber}`;
    }
}
