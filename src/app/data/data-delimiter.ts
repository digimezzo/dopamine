import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataDelimiter {
    public delimiter: string = ';';
    public doubleDelimiter: string = `;;`;

    public convertToDelimitedString(stringArray: string[]): string {
        if (stringArray === null || stringArray === undefined) {
            return '';
        }

        if (stringArray.length === 0) {
            return '';
        }

        const delimitedString: string = stringArray.filter(x => x !== '').map(x => this.addDelimiters(x.trim())).join('');

        return delimitedString;
    }

    private addDelimiters(originalString: string): string {
        const delimitedString: string = `${this.delimiter}${originalString}${this.delimiter}`;

        return delimitedString;
    }
}
