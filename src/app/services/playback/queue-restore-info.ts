import { Queue } from './queue';
import { TrackModel } from '../track/track-model';

export class QueueRestoreInfo {
    public constructor(
        public tracks: TrackModel[],
        public playbackOrder: number[],
        public playingTrack: TrackModel | undefined,
        public progressSeconds: number,
    ) {}
}
