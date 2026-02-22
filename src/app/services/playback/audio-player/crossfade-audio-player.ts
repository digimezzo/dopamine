import { Observable, Subject } from 'rxjs';
import { Logger } from '../../../common/logger';
import { MathExtensions } from '../../../common/math-extensions';
import { IAudioPlayer } from './i-audio-player';
import { TrackModel } from '../../track/track-model';
import { PathUtils } from '../../../common/utils/path-utils';
import { SettingsBase } from '../../../common/settings/settings.base';

export class CrossfadeAudioPlayer implements IAudioPlayer {
    private _audioContext: AudioContext;

    private _currentAudio!: HTMLAudioElement;
    private _nextAudio!: HTMLAudioElement;

    private _currentSource!: MediaElementAudioSourceNode;
    private _nextSource!: MediaElementAudioSourceNode;

    private _currentGain!: GainNode;
    private _nextGain!: GainNode;

    private _masterGain!: GainNode;
    private _analyser!: AnalyserNode;

    private _crossfadeTimer: NodeJS.Timeout | number | undefined;
    private _isCrossfading = false;
    private _isPaused = false;

    private _preloadedTrack?: TrackModel;

    private _playbackFinished = new Subject<void>();
    private _playbackFailed = new Subject<string>();
    private _playingPreloadedTrack = new Subject<TrackModel>();

    public playbackFinished$: Observable<void> = this._playbackFinished.asObservable();
    public playbackFailed$: Observable<string> = this._playbackFailed.asObservable();
    public playingPreloadedTrack$: Observable<TrackModel> = this._playingPreloadedTrack.asObservable();

    public constructor(
        private mathExtensions: MathExtensions,

        private settings: SettingsBase,
        private logger: Logger,
    ) {
        this._audioContext = new AudioContext();

        this._masterGain = this._audioContext.createGain();
        this._analyser = this._audioContext.createAnalyser();
        this._analyser.fftSize = 128;

        this._masterGain.connect(this._analyser);
        this._analyser.connect(this._audioContext.destination);

        this.initializeAudioElements();
    }

    private initializeAudioElements(): void {
        this._currentAudio = new Audio();
        this._nextAudio = new Audio();

        this._currentSource = this._audioContext.createMediaElementSource(this._currentAudio);
        this._nextSource = this._audioContext.createMediaElementSource(this._nextAudio);

        this._currentGain = this._audioContext.createGain();
        this._nextGain = this._audioContext.createGain();

        this._currentSource.connect(this._currentGain);
        this._nextSource.connect(this._nextGain);

        this._currentGain.connect(this._masterGain);
        this._nextGain.connect(this._masterGain);

        this._currentGain.gain.value = 1;
        this._nextGain.gain.value = 0;

        this._currentAudio.onended = () => {
            if (!this._isCrossfading) {
                this._playbackFinished.next();
            }
        };
    }

    public get analyser(): AnalyserNode {
        return this._analyser;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get progressSeconds(): number {
        return isNaN(this._currentAudio.currentTime) ? 0 : this._currentAudio.currentTime;
    }

    public get totalSeconds(): number {
        return isNaN(this._currentAudio.duration) ? 0 : this._currentAudio.duration;
    }

    public async playAsync(track: TrackModel): Promise<void> {
        this.stopInternal();

        const path = PathUtils.createPlayableAudioFilePath(track.path);
        this._currentAudio.src = path;

        try {
            await this._audioContext.resume();
            await this._currentAudio.play();
            this._isPaused = false;
            this.startCrossfadeWatcher();
        } catch (e) {
            this.logger.error(e, `Failed to play ${path}`, 'CrossfadeAudioPlayer', 'playAsync');
            this._playbackFailed.next(path);
        }
    }

    public async startPausedAsync(track: TrackModel, skipSeconds: number): Promise<void> {
        await this.playAsync(track);
        await this.skipToSecondsAsync(skipSeconds);
        this.pause();
    }

    public pause(): void {
        this._isPaused = true;
        this._currentAudio.pause();
        this._nextAudio.pause();
    }

    public async resumeAsync(): Promise<void> {
        await this._audioContext.resume();
        await this._currentAudio.play();
        this._isPaused = false;
    }

    public stop(): void {
        this.stopInternal();
    }

    private stopInternal(): void {
        if (this._crossfadeTimer !== undefined && this._crossfadeTimer !== null) {
            clearInterval(this._crossfadeTimer);
        }

        this._isCrossfading = false;

        this._currentAudio.pause();
        this._nextAudio.pause();

        this._currentAudio.currentTime = 0;
        this._nextAudio.currentTime = 0;
    }

    public setVolume(linearVolume: number): void {
        const value = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;

        this._masterGain.gain.value = value;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async skipToSecondsAsync(seconds: number): Promise<void> {
        this._currentAudio.currentTime = seconds;
    }

    public preloadNext(track: TrackModel): void {
        this._preloadedTrack = track;

        const path = PathUtils.createPlayableAudioFilePath(track.path);
        this._nextAudio.src = path;
        this._nextAudio.load();
    }

    public getAudio(): HTMLAudioElement | undefined {
        return this._currentAudio;
    }

    private startCrossfadeWatcher(): void {
        if (this._crossfadeTimer !== undefined && this._crossfadeTimer !== null) {
            clearInterval(this._crossfadeTimer);
        }

        this._crossfadeTimer = window.setInterval(() => {
            if (!this._preloadedTrack || this._isCrossfading) {
                return;
            }

            if (this._currentAudio.duration === 0) {
                return;
            }

            const remaining = this._currentAudio.duration - this._currentAudio.currentTime;

            if (remaining <= this.settings.crossfadeDuration) {
                clearInterval(this._crossfadeTimer);
                void this.beginCrossfadeAsync();
            }
        }, 500);
    }

    private async beginCrossfadeAsync(): Promise<void> {
        if (!this._preloadedTrack || this._isCrossfading) return;

        this._isCrossfading = true;

        try {
            await this._nextAudio.play();
        } catch (e) {
            this.logger.error(e, 'Failed to play preloaded track', 'CrossfadeAudioPlayer', 'beginCrossfadeAsync');
            return;
        }

        const now: number = this._audioContext.currentTime;
        const fade: number = this.settings.crossfadeDuration;

        // Fade out current
        this._currentGain.gain.setValueAtTime(1, now);
        this._currentGain.gain.linearRampToValueAtTime(0, now + fade);

        // Fade in next
        this._nextGain.gain.setValueAtTime(0, now);
        this._nextGain.gain.linearRampToValueAtTime(1, now + fade);

        setTimeout(() => this.finishCrossfade(), fade * 1000);
    }

    private finishCrossfade(): void {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;

        // Swap references
        [this._currentAudio, this._nextAudio] = [this._nextAudio, this._currentAudio];
        [this._currentGain, this._nextGain] = [this._nextGain, this._currentGain];
        [this._currentSource, this._nextSource] = [this._nextSource, this._currentSource];

        this._nextGain.gain.value = 0;

        const finishedTrack = this._preloadedTrack;
        this._preloadedTrack = undefined;
        this._isCrossfading = false;

        if (finishedTrack) {
            this._playingPreloadedTrack.next(finishedTrack);
        }

        this.startCrossfadeWatcher();
    }
}
