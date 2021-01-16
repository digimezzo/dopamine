import moment from 'moment';

export class Timer {
    private startedMilliseconds: number;
    private stoppedMilliseconds: number;

    public get elapsedMilliseconds(): number {
        return this.stoppedMilliseconds - this.startedMilliseconds;
    }

    public start(): void {
        this.startedMilliseconds = moment().valueOf();
    }

    public stop(): void {
        this.stoppedMilliseconds = moment().valueOf();
    }
}
