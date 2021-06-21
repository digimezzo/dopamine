import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../common/application/constants';

@Pipe({ name: 'alphabeticalHeader' })
export class AlphabeticalHeaderPipe implements PipeTransform {
    constructor() {}

    public transform(name: string): string {
        const firstCharacter: string = name.charAt(0);

        if (Constants.alphabeticalHeaders.includes(firstCharacter)) {
            return firstCharacter;
        }

        return '#';
    }
}
