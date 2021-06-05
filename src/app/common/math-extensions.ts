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
}
