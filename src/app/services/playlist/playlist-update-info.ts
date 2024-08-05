import { TrackModel } from '../track/track-model';

export class PlaylistUpdateInfo {
    public constructor(
        public playlistPath: string,
        public tracks: TrackModel[],
    ) {}
}
