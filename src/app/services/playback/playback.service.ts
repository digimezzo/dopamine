import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../core/logger';
import { TrackModel } from '../track/track-model';
import { BaseAudioPlayer } from './base-audio-player';
import { BasePlaybackService } from './base-playback.service';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';
import { ProgressUpdater } from './progress-updater';
import { Queue } from './queue';

@Injectable({
    providedIn: 'root',
})
export class PlaybackService implements BasePlaybackService {
    private progressChanged: Subject<PlaybackProgress> = new Subject();
    private _progress: PlaybackProgress = new PlaybackProgress(0, 0);
    private _loopMode: LoopMode = LoopMode.None;
    private _isShuffled: boolean = false;
    private _isPlaying: boolean = false;
    private _canPause: boolean = false;
    private _canResume: boolean = true;
    private subscription: Subscription = new Subscription();

    constructor(
        private audioPlayer: BaseAudioPlayer,
        private queue: Queue,
        private progressUpdater: ProgressUpdater,
        private logger: Logger
    ) {
        this.initializeSubscriptions();
    }

    public currentTrack: TrackModel;

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();

    public get progress(): PlaybackProgress {
        return this._progress;
    }

    public get loopMode(): LoopMode {
        return this._loopMode;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
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

    public enqueueAndPlay(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
        if (tracksToEnqueue == undefined) {
            return;
        }

        if (tracksToEnqueue.length === 0) {
            return;
        }

        if (trackToPlay == undefined) {
            return;
        }

        this.queue.setTracks(tracksToEnqueue, this.isShuffled);
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
            this.queue.shuffle();
        } else {
            this.queue.unShuffle();
        }

        this.logger.info(`Toggled isShuffled from ${!this._isShuffled} to ${this._isShuffled}`, 'PlaybackService', 'toggleIsShuffled');
    }

    public pause(): void {
        this.audioPlayer.pause();
        this._canPause = false;
        this._canResume = true;
        this.progressUpdater.pauseUpdatingProgress();

        this.logger.info(`Pausing '${this.currentTrack?.path}'`, 'PlaybackService', 'pause');
    }

    public resume(): void {
        if (!this.isPlaying) {
            return;
        }

        this.audioPlayer.resume();
        this._canPause = true;
        this._canResume = false;
        this.progressUpdater.startUpdatingProgress();

        this.logger.info(`Resuming '${this.currentTrack?.path}'`, 'PlaybackService', 'resume');
    }

    public playPrevious(): void {
        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel = this.queue.getPreviousTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay);

            return;
        }

        this.stop();
    }

    public playNext(): void {
        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay);

            return;
        }

        this.stop();
    }

    public skipByFractionOfTotalSeconds(fractionOfTotalSeconds: number): void {
        const seconds: number = fractionOfTotalSeconds * this.audioPlayer.totalSeconds;
        this.audioPlayer.skipToSeconds(seconds);
    }

    private play(trackToPlay: TrackModel): void {
        this.audioPlayer.stop();
        this.audioPlayer.play(trackToPlay.path);
        this.currentTrack = trackToPlay;
        this._isPlaying = true;
        this._canPause = true;
        this._canResume = false;
        this.progressUpdater.startUpdatingProgress();

        this.logger.info(`Playing '${this.currentTrack?.path}'`, 'PlaybackService', 'play');
    }

    private stop(): void {
        this.audioPlayer.stop();
        this._isPlaying = false;
        this._canPause = false;
        this._canResume = true;
        this.progressUpdater.stopUpdatingProgress();

        this.logger.info(`Stopping '${this.currentTrack?.path}'`, 'PlaybackService', 'stop');
    }

    private playNextOnPlaybackFinished(): void {
        if (this.loopMode === LoopMode.One) {
            this.play(this.currentTrack);

            return;
        }

        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay);

            return;
        }

        this.stop();
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.audioPlayer.playbackFinished$.subscribe(() => {
                this.playNextOnPlaybackFinished();
            })
        );

        this.subscription.add(
            this.progressUpdater.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                this._progress = playbackProgress;
                this.progressChanged.next(playbackProgress);
            })
        );
    }
}
