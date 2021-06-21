import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'alphabeticalHeader' })
export class AlphabeticalHeaderPipe implements PipeTransform {
    constructor() {}

    public transform(name: string): string {
        if (trackNumber == undefined) {
            return '';
        }

        if (trackNumber <= 0) {
            return '';
        }

        if (trackNumber >= 1 && trackNumber <= 9) {
            return trackNumber.toString();
        }

        return trackNumber.toString();
    }
}
