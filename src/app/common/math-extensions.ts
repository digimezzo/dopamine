import { Injectable } from '@angular/core';

@Injectable()
export class MathExtensions {
    public clamp(proposedNumber: number, minimumNumber: number, maximumNumber: number): number {
        if (proposedNumber > maximumNumber) {
            return maximumNumber;
        } else if (proposedNumber < minimumNumber) {
            return minimumNumber;
        } else {
            return proposedNumber;
        }
    }

    public linearToLogarithmic(linearValue: number, min: number, max: number): number {
        const minLog: number = Math.log(min);
        const maxLog: number = Math.log(max);
        const scale: number = (maxLog - minLog) / (max - min);

        return Math.exp(minLog + scale * (linearValue - min));
    }
}
