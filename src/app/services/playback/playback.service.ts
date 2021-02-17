import { Injectable } from '@angular/core';
import { BaseAudioPlayer } from '../../core/audio/base-audio-player';
import { BasePlaybackService } from './base-playback.service';

@Injectable({
    providedIn: 'root',
})
export class PlaybackService implements BasePlaybackService {
    private _canPause: boolean = false;
    private _canResume: boolean = true;
    private _progressPercent: number = 0;

    constructor(private audioPlayer: BaseAudioPlayer) {}

    public get canPause(): boolean {
        return this._canPause;
    }

    public get canResume(): boolean {
        return this._canResume;
    }

    public get progressPercent(): number {
        return this._progressPercent;
    }

    // public enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
    //     this.audioPlayer.play(trackToPlay.path);
    // }

    // public pause(): void {
    //     this.audioPlayer.pause();
    // }
}
