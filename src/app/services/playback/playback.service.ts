import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseAudioPlayer } from '../../core/audio/base-audio-player';
import { Logger } from '../../core/logger';
import { TrackModel } from '../track/track-model';
import { BasePlaybackService } from './base-playback.service';
import { LoopMode } from './loop-mode';

@Injectable({
    providedIn: 'root',
})
export class PlaybackService implements BasePlaybackService {
    private _loopMode: LoopMode = LoopMode.None;
    private _isShuffled: boolean = false;
    private _canPause: boolean = false;
    private _canResume: boolean = true;
    private _progressPercent: number = 0;
    private progressRequestId: number;
    private currentTrack: TrackModel;
    private queuedTracks: TrackModel[] = [];
    private playbackOrder: number[] = [];
    private subscription: Subscription = new Subscription();

    constructor(private audioPlayer: BaseAudioPlayer, private logger: Logger) {
        this.subscription.add(
            this.audioPlayer.playBackFinished$.subscribe(() => {
                this.playNextOnPlaybackFinished();
            })
        );
    }

    private findPlaybackOrderIndex(track: TrackModel): number {
        const queuedTracksIndex: number = this.queuedTracks.indexOf(track);

        return this.playbackOrder.indexOf(queuedTracksIndex);
    }

    private populatePlayBackOrder(): void {
        this.playbackOrder = [];

        for (let i: number = 0; i < this.queuedTracks.length; i++) {
            this.playbackOrder.push(i);
        }
    }

    private enqueue(tracksToEnqueue: TrackModel[]): void {
        this.queuedTracks = tracksToEnqueue;
        this.populatePlayBackOrder();

        this.logger.info(`Queued '${tracksToEnqueue?.length}' tracks`, 'PlaybackService', 'fillQueuedTracks');
    }

    public get loopMode(): LoopMode {
        return this._loopMode;
    }

    public get isShuffled(): boolean {
        return this._isShuffled;
    }

    public get canPause(): boolean {
        return this._canPause;
    }

    public get canResume(): boolean {
        return this._canResume;
    }

    public get progressPercent(): number {
        return this._progressPercent;
    }

    public set progressPercent(v: number) {
        this._progressPercent = v;
    }

    public enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
        this.enqueue(tracksToEnqueue);
        this.play(trackToPlay);
    }

    public toggleLoopMode(): void {
        const oldLoopMode: LoopMode = this._loopMode;

        if (this._loopMode === LoopMode.None) {
            this._loopMode = LoopMode.All;
        } else if (this._loopMode === LoopMode.All) {
            this._loopMode = LoopMode.One;
        } else if (this._loopMode === LoopMode.One) {
            this._loopMode = LoopMode.None;
        } else {
            this._loopMode = LoopMode.None;
        }

        this.logger.info(`Toggled loopMode from ${oldLoopMode} to ${this._loopMode}`, 'PlaybackService', 'toggleLoopMode');
    }

    public toggleIsShuffled(): void {
        this._isShuffled = !this._isShuffled;

        if (this._isShuffled) {
            this.shufflePlaybackOrder();
        } else {
            this.populatePlayBackOrder();
        }

        this.logger.info(`Toggled isShuffled from ${!this._isShuffled} to ${this._isShuffled}`, 'PlaybackService', 'toggleIsShuffled');
    }

    private shufflePlaybackOrder(): void {
        for (let i: number = this.playbackOrder.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            const temp: number = this.playbackOrder[i];
            this.playbackOrder[i] = this.playbackOrder[j];
            this.playbackOrder[j] = temp;
        }
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

    private getPreviousTrack(): TrackModel {
        if (this.playbackOrder.length === 0 || this.queuedTracks.length === 0) {
            return undefined;
        }

        if (this.loopMode === LoopMode.One) {
            return this.currentTrack;
        }

        const minimumIndex: number = 0;
        const maximumIndex: number = this.playbackOrder.length - 1;
        const currentIndex: number = this.findPlaybackOrderIndex(this.currentTrack);

        if (currentIndex > minimumIndex) {
            return this.queuedTracks[this.playbackOrder[currentIndex - 1]];
        }

        if (this.loopMode === LoopMode.All) {
            return this.queuedTracks[this.playbackOrder[maximumIndex]];
        }

        return undefined;
    }

    private getNextTrack(allowLoopOne: boolean): TrackModel {
        if (this.playbackOrder.length === 0 || this.queuedTracks.length === 0) {
            return undefined;
        }

        if (this.loopMode === LoopMode.One && allowLoopOne) {
            return this.currentTrack;
        }

        const minimumIndex: number = 0;
        const maximumIndex: number = this.playbackOrder.length - 1;
        const currentIndex: number = this.findPlaybackOrderIndex(this.currentTrack);

        if (currentIndex < maximumIndex) {
            return this.queuedTracks[this.playbackOrder[currentIndex + 1]];
        }

        if (this.loopMode === LoopMode.All) {
            return this.queuedTracks[this.playbackOrder[minimumIndex]];
        }

        return undefined;
    }

    public playPrevious(): void {
        const trackToPlay: TrackModel = this.getPreviousTrack();

        if (trackToPlay != undefined) {
            this.play(trackToPlay);

            return;
        }

        this.stop();
    }

    public playNext(): void {
        const trackToPlay: TrackModel = this.getNextTrack(false);

        if (trackToPlay != undefined) {
            this.play(trackToPlay);

            return;
        }

        this.stop();
    }

    private playNextOnPlaybackFinished(): void {
        const trackToPlay: TrackModel = this.getNextTrack(true);

        if (trackToPlay != undefined) {
            this.play(trackToPlay);
        }

        this.stop();
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
