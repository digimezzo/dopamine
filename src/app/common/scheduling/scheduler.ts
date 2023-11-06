import { Injectable } from '@angular/core';
import { SchedulerBase } from './scheduler.base';

@Injectable()
export class Scheduler implements SchedulerBase {
    public async sleepAsync(milliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    public async sleepUntilConditionIsTrueAsync(milliseconds: number, maximumMilliseconds: number, condition: boolean): Promise<void> {
        let currentWaitTime: number = 0;

        while (currentWaitTime < maximumMilliseconds) {
            if (condition) {
                return;
            } else {
                currentWaitTime += milliseconds;
                await this.sleepAsync(milliseconds);
            }
        }
    }
}
