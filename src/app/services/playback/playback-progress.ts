export class PlaybackProgress {
    constructor(public progressSeconds: number, public totalSeconds: number) {
        this.progressSeconds = 0;
        this.totalSeconds = 0;
    }
}
