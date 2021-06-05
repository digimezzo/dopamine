import { Injectable } from '@angular/core';

@Injectable()
export class ListRandomizer {
    public randomizeNumbers(numbers: number[]): number[] {
        for (let i: number = numbers.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            const temp: number = numbers[i];
            numbers[i] = numbers[j];
            numbers[j] = temp;
        }

        return numbers;
    }
}
