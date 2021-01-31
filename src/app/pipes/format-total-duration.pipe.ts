import { Pipe, PipeTransform } from '@angular/core';
import { TranslatorService } from '../services/translator/translator.service';

@Pipe({ name: 'formatTotalDuration' })
export class FormatTotalDurationPipe implements PipeTransform {
    constructor(private translatorService: TranslatorService) {}

    public transform(totalDurationInMilliseconds: number): string {
        if (totalDurationInMilliseconds == undefined || totalDurationInMilliseconds <= 0) {
            return '';
        }

        const hoursText: string = this.translatorService.get('Durations.Hours');
        const minutesText: string = this.translatorService.get('Durations.Minutes');
        const secondsText: string = this.translatorService.get('Durations.Seconds');

        const totalDurationInSeconds: number = Math.floor(totalDurationInMilliseconds / 1000);

        const hours: number = Math.floor(totalDurationInSeconds / (60 * 60));
        const minutes: number = Math.floor(totalDurationInSeconds / 60) % 60;
        const seconds: number = totalDurationInSeconds % 60;

        if (hours > 0) {
            return `${hours} ${hoursText} ${minutes} ${minutesText} ${seconds} ${secondsText}`;
        }

        if (minutes > 0) {
            return `${minutes} ${minutesText} ${seconds} ${secondsText}`;
        }

        return `${seconds} ${secondsText}`;
    }
}
