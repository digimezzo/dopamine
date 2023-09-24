import { Injectable } from '@angular/core';

@Injectable()
export class Shuffler {
    /**
     *
     * @param array Based on https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @returns
     */
    public shuffle(array: any[]): any[] {
        let currentIndex: number = array.length;
        let randomIndex: number = 0;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}
