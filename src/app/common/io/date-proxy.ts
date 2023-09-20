import { Injectable } from '@angular/core';

@Injectable()
export class DateProxy {
    public now(): number {
        return Date.now();
    }
}
