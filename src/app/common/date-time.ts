import { Injectable } from '@angular/core';

@Injectable()
export class DateTime {
    /**
     * Converts a Javascript Date to .NET Ticks.
     * See: https://stackoverflow.com/questions/7966559/how-to-convert-javascript-date-object-to-ticks
     * The JavaScript Date type's origin is the Unix epoch: midnight on 1 January 1970.
     * The .NET DateTime type's origin is midnight on 1 January 0001.
     * So a JavaScript Date object must be translated to .NET ticks.
     * @param date The date to convert to .NET Ticks
     */
    public convertDateToTicks(date: Date): number {
        // The number of .net ticks at the unix epoch
        const epochTicks: number = 621355968000000000;

        // There are 10000 .net ticks per millisecond
        const ticksPerMillisecond: number = 10000;

        // Date in JavaScript also contains time zone offset. We need to remove it.
        const offsetInTicks: number = date.getTimezoneOffset() * 600000000;

        // Calculate the total number of .NET ticks for the given date
        const dotNetTicks: number = epochTicks + date.getTime() * ticksPerMillisecond - offsetInTicks;

        return dotNetTicks;
    }

    public convertTicksToDate(ticks: number): Date {
        // Based on https://github.com/vyushin/ticks-to-date/blob/master/src/ticksToDate.js
        const dateWithoutOffset: Date = new Date(ticks / 10000 + new Date('0001-01-01T00:00:00Z').getTime());

        const offset: number = dateWithoutOffset.getTimezoneOffset();
        const offsetInMilliseconds: number = offset * 60000;

        const date: Date = new Date(dateWithoutOffset.getTime() + offsetInMilliseconds);

        return date;
    }

    public convertDateToUnixTime(date: Date): number {
        // Date in JavaScript also contains time zone offset. We need to remove it.
        const offsetInMilliseconds: number = date.getTimezoneOffset() * 60000;

        // Calculate the Unix time for the given date
        const unixTime: number = Math.floor((date.getTime() - offsetInMilliseconds) / 1000);

        return unixTime;
    }

    public ticksToMilliseconds(ticks: number): number {
        return ticks / 10000;
    }

    public getUTCDate(localDate: Date): Date {
        const offsetInMinutes: number = localDate.getTimezoneOffset();
        const offsetInMilliseconds: number = offsetInMinutes * 60000;

        const utcDate: Date = new Date(localDate.getTime() + offsetInMilliseconds);

        return utcDate;
    }
}
