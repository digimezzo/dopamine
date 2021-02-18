import { Injectable } from '@angular/core';
import { BaseAudioPlayer } from '../../core/audio/base-audio-player';
import { Logger } from '../../core/logger';
import { TrackModel } from '../track/track-model';
import { BasePlaybackService } from './base-playback.service';

@Injectable({
    providedIn: 'root',
})
export class PlaybackService implements BasePlaybackService {
    private _canPause: boolean = false;
    private _canResume: boolean = true;
    private _progressPercent: number = 0;
    private progressRequestId: number;

    constructor(private audioPlayer: BaseAudioPlayer, private logger: Logger) {}

    public get canPause(): boolean {
        return this._canPause;
    }

    public get canResume(): boolean {
        return this._canResume;
    }

    public get progressPercent(): number {
        return this._progressPercent;
    }

    public enqueue(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
        this.audioPlayer.setVolume(0.5);
        this.audioPlayer.play(trackToPlay.path);
        this._canPause = true;
        this._canResume = false;
        this.startUpdatingProgress();
        this.logger.info(`Playing '${trackToPlay.path}'`, 'PlaybackService', 'enqueue');
    }

    public pause(): void {
        this.audioPlayer.pause();
        this._canPause = false;
        this._canResume = true;
        this.stopUpdatingProgress();
    }

    public resume(): void {
        this.audioPlayer.resume();
        this._canPause = true;
        this._canResume = false;
        this.startUpdatingProgress();
    }

    private updateProgress(): void {
        this.progressRequestId = undefined;
        this._progressPercent = this.audioPlayer.progressPercent;
        this.progressRequestId = requestAnimationFrame(this.updateProgress.bind(this));

        // setInterval(() => {
        //     this._progressPercent = this.audioPlayer.progressPercent;
        // }, 250);
    }

    private startUpdatingProgress(): void {
        if (this.progressRequestId == undefined) {
            this.progressRequestId = requestAnimationFrame(this.updateProgress.bind(this));
        }
    }

    private stopUpdatingProgress(): void {
        if (this.progressRequestId != undefined) {
            cancelAnimationFrame(this.progressRequestId);
            this.progressRequestId = undefined;
        }
    }
}
