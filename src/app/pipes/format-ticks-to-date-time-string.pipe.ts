import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from '../common/date-time';

@Pipe({ name: 'formatTicksToDateTimeString' })
export class FormatTicksToDateTimeStringPipe implements PipeTransform {
    constructor() {}

    public transform(ticks: number): string {
        if (ticks == undefined || ticks <= 0) {
            return '';
        }

        const date: Date = DateTime.convertTicksToDate(ticks);

        const year: number = date.getFullYear();
        const month: string = ('0' + (date.getMonth() + 1)).slice(-2);
        const day: string = ('0' + date.getDate()).slice(-2);
        const hours: number = date.getHours();
        const minutes: string = ('0' + date.getMinutes()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}
