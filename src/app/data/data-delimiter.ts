import { Constants } from '../common/application/constants';
import { StringUtils } from '../common/utils/string-utils';

export class DataDelimiter {
    private static delimiter: string = Constants.columnValueDelimiter;
    private static doubleDelimiter: string = `${DataDelimiter.delimiter}${DataDelimiter.delimiter}`;

    public static toDelimitedString(stringArray: string[] | undefined): string {
        if (!Array.isArray(stringArray) || stringArray.length === 0) {
            return '';
        }

        const result: string[] = [];

        for (const item of stringArray) {
            const parts = item
                .split(';') // Split by semicolon
                .map((x) => x.trim()) // Trim whitespace
                .filter((x) => x !== ''); // Remove empty strings

            for (const part of parts) {
                result.push(this.addDelimiters(part));
            }
        }

        return result.join('');
    }

    public static fromDelimitedString(delimitedString: string | undefined): string[] {
        if (StringUtils.isNullOrWhiteSpace(delimitedString)) {
            return [''];
        }

        const delimitedStrings: string[] = delimitedString!.split(DataDelimiter.delimiter);

        return delimitedStrings.filter((x) => x !== '').map((x) => this.removeDelimiters(x));
    }

    public static isUnknownValue(values: string[] = []): boolean {
        return values.length === 0 || (values.length === 1 && StringUtils.isNullOrWhiteSpace(values[0]));
    }

    private static addDelimiters(originalString: string): string {
        const delimitedString: string = `${this.delimiter}${originalString}${this.delimiter}`;

        return delimitedString;
    }

    private static removeDelimiters(delimitedString: string): string {
        const nonDelimitedString: string = delimitedString.split(this.delimiter).join('');

        return nonDelimitedString;
    }
}
