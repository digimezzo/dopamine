import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zeroToBlank' })
export class ZeroToBlankPipe implements PipeTransform {
    public transform(number: number | undefined): string {
        if (number == undefined) {
            return '';
        }

        if (number === 0) {
            return '';
        }

        return number.toString();
    }
}
