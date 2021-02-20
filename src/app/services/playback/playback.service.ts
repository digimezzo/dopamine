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
    private currentTrack: TrackModel;
    private queuedTracks: TrackModel[] = [];

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
        this.queuedTracks = tracksToEnqueue;
        this.logger.info(`Queued '${tracksToEnqueue?.length}' tracks`, 'PlaybackService', 'enqueue');
        this.play(trackToPlay);
    }

    private play(trackToPlay: TrackModel): void {
        this.audioPlayer.stop();
        this.audioPlayer.play(trackToPlay.path);
        this.currentTrack = trackToPlay;
        this._canPause = true;
        this._canResume = false;
        this.startUpdatingProgress();
        this.logger.info(`Playing '${this.currentTrack?.path}'`, 'PlaybackService', 'play');
    }

    public pause(): void {
        this.audioPlayer.pause();
        this._canPause = false;
        this._canResume = true;
        this.stopUpdatingProgress();
        this.logger.info(`Pausing '${this.currentTrack?.path}'`, 'PlaybackService', 'pause');
    }

    public resume(): void {
        this.audioPlayer.resume();
        this._canPause = true;
        this._canResume = false;
        this.startUpdatingProgress();
        this.logger.info(`Resuming '${this.currentTrack?.path}'`, 'PlaybackService', 'resume');
    }

    private stop(): void {
        this.audioPlayer.stop();
        this._canPause = false;
        this._canResume = true;
        this.stopUpdatingProgress();
        this.logger.info(`Stopping '${this.currentTrack?.path}'`, 'PlaybackService', 'stop');
    }

    public playPrevious(): void {
        if (this.queuedTracks.length === 0) {
            return;
        }

        const minimumIndex: number = 0;
        const currentIndex: number = this.queuedTracks.indexOf(this.currentTrack);

        if (currentIndex < 0) {
            return;
        }

        if (currentIndex === minimumIndex) {
            this.play(this.currentTrack);

            return;
        }

        if (this.audioPlayer.progressSeconds > 3) {
            this.play(this.currentTrack);

            return;
        }

        this.play(this.queuedTracks[currentIndex - 1]);
    }

    public playNext(): void {
        if (this.queuedTracks.length === 0) {
            return;
        }

        const maximumIndex: number = this.queuedTracks.length - 1;
        const currentIndex: number = this.queuedTracks.indexOf(this.currentTrack);

        if (currentIndex < 0) {
            return;
        }

        if (currentIndex === maximumIndex) {
            this.stop();

            return;
        }

        this.play(this.queuedTracks[currentIndex + 1]);
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

        this._progressPercent = 0;
    }
}
