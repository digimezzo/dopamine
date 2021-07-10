import { Injectable } from '@angular/core';
import { PathValidator } from '../../common/path-validator';
import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';
import { BasePlaybackIndicationService } from './base-playback-indication.service';

@Injectable()
export class PlaybackIndicationService implements BasePlaybackIndicationService {
    constructor(private pathValidator: PathValidator) {}

    public setPlayingSubfolder(subfolders: SubfolderModel[], playingTrack: TrackModel): void {
        if (subfolders == undefined) {
            return;
        }

        if (playingTrack == undefined) {
            return;
        }

        for (const subfolder of subfolders) {
            subfolder.isPlaying = false;

            if (!subfolder.isGoToParent && this.pathValidator.isParentPath(subfolder.path, playingTrack.path)) {
                subfolder.isPlaying = true;
            }
        }
    }

    public clearPlayingSubfolder(subfolders: SubfolderModel[]): void {
        if (subfolders == undefined) {
            return;
        }

        for (const subfolder of subfolders) {
            subfolder.isPlaying = false;
        }
    }

    public setPlayingTrack(tracks: TrackModel[], playingTrack: TrackModel): void {
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

    public clearPlayingTrack(tracks: TrackModel[]): void {
        if (tracks == undefined) {
            return;
        }

        for (const track of tracks) {
            track.isPlaying = false;
        }
    }
}
