class DateTime {
    /**
     * Converts a Javascript Date to .NET Ticks.
     * See: https://stackoverflow.com/questions/7966559/how-to-convert-javascript-date-object-to-ticks
     * The JavaScript Date type's origin is the Unix epoch: midnight on 1 January 1970.
     * The .NET DateTime type's origin is midnight on 1 January 0001.
     * So a JavaScript Date object must be translated to .NET ticks.
     * @param date The date to convert to .NET Ticks
     */
    convertDateToTicks(date) {
        // The number of .net ticks at the unix epoch
        const epochTicks = 621355968000000000;

        // There are 10000 .net ticks per millisecond
        const ticksPerMillisecond = 10000;

        // Date in JavaScript also contains time zone offset. We need to remove it.
        const offsetInTicks = date.getTimezoneOffset() * 600000000;

        // Calculate the total number of .NET ticks for the given date
        return epochTicks + date.getTime() * ticksPerMillisecond - offsetInTicks;
    }
}

exports.DateTime = DateTime;
