import { Pipe, PipeTransform } from '@angular/core';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatTotalDuration' })
export class FormatTotalDurationPipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(totalDurationInMilliseconds: number): string {
        if (totalDurationInMilliseconds == undefined || totalDurationInMilliseconds <= 0) {
            return '';
        }

        const daysText: string = this.translatorService.get('days');
        const hoursText: string = this.translatorService.get('hours');
        const minutesText: string = this.translatorService.get('minutes');
        const secondsText: string = this.translatorService.get('seconds');

        const totalDurationInSeconds: number = Math.floor(totalDurationInMilliseconds / 1000);

        const unroundedDays: number = totalDurationInSeconds / (60 * 60 * 24);
        const days: number = Math.floor(unroundedDays);
        const hours: number = Math.floor(totalDurationInSeconds / (60 * 60));
        const minutes: number = Math.floor(totalDurationInSeconds / 60) % 60;
        const seconds: number = totalDurationInSeconds % 60;

        if (days > 0) {
            return `${unroundedDays.toFixed(1)} ${daysText}`;
        }

        if (hours > 0) {
            return `${hours} ${hoursText} ${minutes} ${minutesText} ${seconds} ${secondsText}`;
        }

        if (minutes > 0) {
            return `${minutes} ${minutesText} ${seconds} ${secondsText}`;
        }

        return `${seconds} ${secondsText}`;
    }
}
