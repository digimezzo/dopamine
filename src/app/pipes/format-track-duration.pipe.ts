import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatTrackDuration' })
/**
 * Inspired by: https://dev.to/alexparra/js-seconds-to-hh-mm-ss-22o6
 */
export class FormatTrackDurationPipe implements PipeTransform {
    constructor() {}

    private secondsPerDay: number = 86400;
    private hoursPerDay: number = 24;

    public transform(durationInMilliseconds: number): string {
        if (durationInMilliseconds == undefined || durationInMilliseconds < 0) {
            return '00:00';
        }

        const seconds: number = Math.floor(durationInMilliseconds / 1000);

        const days = Math.floor(seconds / this.secondsPerDay);
        const remainderSeconds = seconds % this.secondsPerDay;
        const date = new Date(remainderSeconds * 1000).toISOString().substring(11, 19);

        const hms = date.replace(/^(\d+)/, (h) => `${Number(h) + days * this.hoursPerDay}`.padStart(2, '0'));

        if (hms.length === 8 && hms.startsWith('00:')) {
            return hms.substr(3);
        }

        return hms;
    }
}
