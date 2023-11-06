import { Injectable } from '@angular/core';
import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';
import { PlaybackIndicationServiceBase } from './playback-indication.service.base';
import { PathValidator } from '../../common/validation/path-validator';

@Injectable()
export class PlaybackIndicationService implements PlaybackIndicationServiceBase {
    public constructor(private pathValidator: PathValidator) {}

    public setPlayingSubfolder(subfolders: SubfolderModel[] | undefined, playingTrack: TrackModel | undefined): void {
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

    public clearPlayingSubfolder(subfolders: SubfolderModel[] | undefined): void {
        if (subfolders == undefined) {
            return;
        }

        for (const subfolder of subfolders) {
            subfolder.isPlaying = false;
        }
    }

    public setPlayingTrack(tracks: TrackModel[] | undefined, playingTrack: TrackModel | undefined): void {
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

    public clearPlayingTrack(tracks: TrackModel[] | undefined): void {
        if (tracks == undefined) {
            return;
        }

        for (const track of tracks) {
            track.isPlaying = false;
        }
    }
}
