import { Injectable } from '@angular/core';
import { BaseScheduler } from './base-scheduler';

@Injectable()
export class Scheduler implements BaseScheduler {
    public async sleepAsync(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
}
