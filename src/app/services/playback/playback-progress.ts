export class PlaybackProgress {
    constructor(public progressSeconds: number, public totalSeconds: number) {}

    public get timeRemainingInMilliSeconds(): number {
        return (this.totalSeconds - this.progressSeconds) * 1000;
    }
}
