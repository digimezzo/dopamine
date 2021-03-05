import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatTrackDuration' })
/**
 * Inspired by: https://dev.to/alexparra/js-seconds-to-hh-mm-ss-22o6
 */
export class FormatTrackDurationPipe implements PipeTransform {
    constructor() {}

    public transform(durationInMilliseconds: number): string {
        if (durationInMilliseconds == undefined || durationInMilliseconds < 0) {
            return '00:00';
        }

        const durationInSeconds: number = Math.floor(durationInMilliseconds / 1000);

        const hours: number = Math.floor(durationInSeconds / (60 * 60));
        const minutes: number = Math.floor(durationInSeconds / 60) % 60;
        const seconds: number = durationInSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
