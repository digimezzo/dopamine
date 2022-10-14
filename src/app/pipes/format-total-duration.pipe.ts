import { Pipe, PipeTransform } from '@angular/core';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatTotalDuration' })
export class FormatTotalDurationPipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(totalMilliseconds: number): string {
        if (totalMilliseconds == undefined || totalMilliseconds <= 0) {
            return '';
        }

        const dayText: string = this.translatorService.get('day');
        const daysText: string = this.translatorService.get('days');
        const hourText: string = this.translatorService.get('hour');
        const hoursText: string = this.translatorService.get('hours');
        const minuteText: string = this.translatorService.get('minute');
        const minutesText: string = this.translatorService.get('minutes');
        const secondText: string = this.translatorService.get('second');
        const secondsText: string = this.translatorService.get('seconds');

        const totalSeconds: number = totalMilliseconds / 1000;
        const totalMinutes: number = totalSeconds / 60;
        const totalHours: number = totalMinutes / 60;
        const totalDays: number = totalHours / 24;

        const roundedTotalDays: number = Math.round(totalDays * 10) / 10;
        const roundedTotalHours: number = Math.round(totalHours * 10) / 10;
        const minutesOnly: number = Math.floor(totalMinutes) % 60;
        const secondsOnly: number = Math.floor(totalSeconds) % 60;

        if (totalDays >= 1 || roundedTotalHours === 24) {
            return `${roundedTotalDays} ${roundedTotalDays === 1 ? dayText : daysText}`;
        }

        if (totalHours >= 1) {
            return `${roundedTotalHours} ${roundedTotalHours === 1 ? hourText : hoursText}`;
        }

        if (totalMinutes >= 1) {
            const secondsSuffix: string = secondsOnly > 0 ? ` ${secondsOnly} ${secondsOnly === 1 ? secondText : secondsText}` : '';

            return `${minutesOnly} ${minutesOnly === 1 ? minuteText : minutesText}${secondsSuffix}`;
        }

        return `${secondsOnly} ${secondsOnly === 1 ? secondText : secondsText}`;
    }
}
