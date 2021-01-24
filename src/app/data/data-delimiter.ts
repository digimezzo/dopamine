import { Injectable } from '@angular/core';
import { StringCompare } from '../core/string-compare';

@Injectable({
    providedIn: 'root',
})
export class DataDelimiter {
    public delimiter: string = ';';
    public doubleDelimiter: string = `;;`;

    public toDelimitedString(stringArray: string[]): string {
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

    public fromDelimitedString(delimitedString: string): string[] {
        if (StringCompare.isNullOrWhiteSpace(delimitedString)) {
            return [];
        }

        const delimitedStrings: string[] = delimitedString.split(this.doubleDelimiter);

        return delimitedStrings.map((x) => this.removeDelimiters(x));
    }

    private addDelimiters(originalString: string): string {
        const delimitedString: string = `${this.delimiter}${originalString}${this.delimiter}`;

        return delimitedString;
    }

    private removeDelimiters(delimitedString: string): string {
        const nonDelimitedString: string = delimitedString.split(this.delimiter).join('');

        return nonDelimitedString;
    }
}
