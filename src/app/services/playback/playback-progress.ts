export class PlaybackProgress {
    public constructor(public progressSeconds: number, public totalSeconds: number) {}

    public get timeRemainingInMilliSeconds(): number {
        if (this.totalSeconds === 0) {
            return 0;
        }

        return (this.totalSeconds - this.progressSeconds) * 1000;
    }

    public get progressPercent(): number {
        if (this.totalSeconds === 0) {
            return 0;
        }

        return (this.progressSeconds / this.totalSeconds) * 100;
    }
}
