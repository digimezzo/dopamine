export class DateTime {
    /**
     * Converts a Javascript Date to .NET Ticks.
     * See: https://stackoverflow.com/questions/7966559/how-to-convert-javascript-date-object-to-ticks
     * The JavaScript Date type's origin is the Unix epoch: midnight on 1 January 1970.
     * The .NET DateTime type's origin is midnight on 1 January 0001.
     * So a JavaScript Date object must be translated to .NET ticks.
     * @param date The date to convert to .NET Ticks
     */
    public static getTicks(date: Date): number {
        // The number of .net ticks at the unix epoch
        const epochTicks: number = 621355968000000000;

        // There are 10000 .net ticks per millisecond
        const ticksPerMillisecond: number = 10000;

        // Calculate the total number of .NET ticks for the given date
        const dotNetTicks: number = epochTicks + (date.getTime() * ticksPerMillisecond);

        return dotNetTicks;
    }

    public static convertToUnixTime(date: Date): number {
        return date.getTime() / 1000;
    }
}
