
export class DataDelimiting {
    public static delimiter: string = ';';
    public static doubleDelimiter: string = `;;`;

    public static convertToDelimitedString(stringArray: string[]): string {
        if (!stringArray) {
            return '';
        }

        if (stringArray.length === 0) {
            return '';
        }

        const delimitedString: string = stringArray.map(x => `${DataDelimiting.delimiter}${x}${DataDelimiting.delimiter}`).join('');

        return delimitedString;
    }

    private static addDelimiters(originalString: string): string {
        const delimitedString: string = `${DataDelimiting.delimiter}${originalString}${DataDelimiting.delimiter}`;

        return delimitedString;
    }
}
