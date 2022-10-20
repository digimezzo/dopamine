import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'formatTicksToDateTimeString' })
export class FormatTicksToDateTimeStringPipe implements PipeTransform {
    constructor() {}

    public transform(ticks: number): string {
        if (ticks == undefined || ticks <= 0) {
            return '';
        }

        const offset: number = (new Date).getTimezoneOffset()
        const offsetInTicks: number = offset * 600000000;

         // Based on https://github.com/vyushin/ticks-to-date/blob/master/src/ticksToDate.js
        const date: Date = new Date((ticks + offsetInTicks) / 10000 + new Date('0001-01-01T00:00:00Z').getTime());

        // const year: number = date.getFullYear();
        // const month: string = ('0' + (date.getMonth()+1)).slice(-2)
        // const day: string  = ('0' + date.getDay()).slice(-2)
        // const hours: number = date.getHours();
        // const minutes: string = ('0' + date.getMinutes()).slice(-2)

        // return `${year}-${month}-${day} ${hours}:${minutes}`;

        return moment(date).format('MMM DD, YYYY HH:mm');;
    }
}
