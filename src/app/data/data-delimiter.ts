import { Constants } from '../common/application/constants';
import { StringUtils } from '../common/utils/string-utils';

export class DataDelimiter {
    private static delimiter: string = Constants.columnValueDelimiter;
    private static doubleDelimiter: string = `${DataDelimiter.delimiter}${DataDelimiter.delimiter}`;

    public static toDelimitedString(stringArray: string[] | undefined): string {
        if (stringArray == undefined) {
            return '';
        }

        if (stringArray.length === 0) {
            return '';
        }

        const delimitedString: string = stringArray
            .filter((x) => x !== '')
            .map((x) => this.addDelimiters(x.trim()))
            .join('');

        return delimitedString;
    }

    public static fromDelimitedString(delimitedString: string | undefined): string[] {
        if (StringUtils.isNullOrWhiteSpace(delimitedString)) {
            return [];
        }

        const delimitedStrings: string[] = delimitedString!.split(DataDelimiter.delimiter);

        return delimitedStrings.filter((x) => x !== '').map((x) => this.removeDelimiters(x));
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
