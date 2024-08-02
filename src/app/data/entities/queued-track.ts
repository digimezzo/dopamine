export class QueuedTrack {
    public constructor(public path: string) {}

    public queuedTrackId: number;
    public isPlaying: number;
    public progressSeconds: number;
    public orderId: number;
}
