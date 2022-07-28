import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPlaybackTime' })
/**
 * Inspired by: https://dev.to/alexparra/js-seconds-to-hh-mm-ss-22o6
 */
export class FormatPlaybackTimePipe implements PipeTransform {
    constructor() {}

    public transform(progressSeconds: number): string {
        if (progressSeconds == undefined || progressSeconds < 0) {
            return '00:00';
        }

        const progressSecondsWithoutMilliseconds: number = Math.floor(progressSeconds);

        const hours: number = Math.floor(progressSecondsWithoutMilliseconds / (60 * 60));
        const minutes: number = Math.floor(progressSecondsWithoutMilliseconds / 60) % 60;
        const seconds: number = progressSecondsWithoutMilliseconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
