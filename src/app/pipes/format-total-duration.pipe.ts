import { Pipe, PipeTransform } from '@angular/core';
import { BaseTranslatorService } from '../services/translator/base-translator.service';

@Pipe({ name: 'formatTotalDuration' })
export class FormatTotalDurationPipe implements PipeTransform {
    constructor(private translatorService: BaseTranslatorService) {}

    public transform(totalDurationInMilliseconds: number): string {
        if (totalDurationInMilliseconds == undefined || totalDurationInMilliseconds <= 0) {
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

        const totalDurationInSeconds: number = totalDurationInMilliseconds / 1000;
        const totalDurationInMinutes: number = totalDurationInSeconds / 60;
        const totalDurationInHours: number = totalDurationInMinutes / 60;
        const totalDurationInDays: number = totalDurationInHours / 24;

        if (totalDurationInDays >= 1) {
            const days: number = Math.round(totalDurationInDays * 10) / 10;

            return `${days} ${days === 1 ? dayText : daysText}`;
        }

        if (totalDurationInHours >= 1) {
            const hours: number = Math.round(totalDurationInHours * 10) / 10;

            if (hours === 24) {
                return `1 ${dayText}`;
            }

            return `${hours} ${hours === 1 ? hourText : hoursText}`;
        }

        const minutes: number = Math.floor(totalDurationInMinutes) % 60;
        const seconds: number = Math.floor(totalDurationInSeconds) % 60;

        if (totalDurationInMinutes >= 1) {
            if (seconds > 0) {
                return `${minutes} ${minutes === 1 ? minuteText : minutesText} ${seconds} ${seconds === 1 ? secondText : secondsText}`;
            }

            return `${minutes} ${minutes === 1 ? minuteText : minutesText}`;
        }

        return `${seconds} ${seconds === 1 ? secondText : secondsText}`;
    }
}
