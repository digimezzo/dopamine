import { Injectable } from '@angular/core';

@Injectable()
export class DateProxy {
    constructor() {}

    public now(): number {
        return Date.now();
    }
}
