import { Injectable } from '@angular/core';
import { BaseAudioPlayer } from '../../core/audio/base-audio-player';
import { TrackModel } from '../track/track-model';
import { BasePlaybackService } from './base-playback.service';

@Injectable({
    providedIn: 'root',
})
export class PlaybackService implements BasePlaybackService {
    constructor(private audioPlayer: BaseAudioPlayer) {}

    public enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
        this.audioPlayer.play(trackToPlay.path);
    }

    public pause(): void {
        this.audioPlayer.pause();
    }
}
