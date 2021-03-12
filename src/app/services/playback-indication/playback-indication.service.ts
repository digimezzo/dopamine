import { Injectable } from '@angular/core';
import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';
import { BasePlaybackIndicationService } from './base-playback-indication.service';

@Injectable({
    providedIn: 'root',
})
export class PlaybackIndicationService implements BasePlaybackIndicationService {
    constructor() {}

    public setPlayingSubfolder(subfolders: SubfolderModel[], playingTrack: TrackModel): Promise<void> {
        if (subfolders == undefined) {
            return;
        }

        if (playingTrack == undefined) {
            return;
        }

        for (const subfolder of subfolders) {
            subfolder.isPlaying = false;

            if (!subfolder.isGoToParent && playingTrack.path.includes(subfolder.path)) {
                subfolder.isPlaying = true;
            }
        }
    }

    public setPlayingTrack(tracks: TrackModel[], playingTrack: TrackModel): Promise<void> {
        if (tracks == undefined) {
            return;
        }

        if (playingTrack == undefined) {
            return;
        }

        for (const track of tracks) {
            track.isPlaying = false;

            if (track.path === playingTrack.path) {
                track.isPlaying = true;
            }
        }
    }
}
