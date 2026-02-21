export class YearFormatter {
    public static formatYear(year: number): string {
        let proposedYear: string = '?';

        if (year != undefined && year !== 0) {
            proposedYear = year.toString();
        }

        return proposedYear;
    }
}
