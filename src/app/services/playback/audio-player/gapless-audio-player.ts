import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IAudioPlayer } from './i-audio-player';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { TrackModel } from '../../track/track-model';
import { PathUtils } from '../../../common/utils/path-utils';
import { SettingsBase } from '../../../common/settings/settings.base';

@Injectable({
    providedIn: 'root',
})
export class GaplessAudioPlayer implements IAudioPlayer {
    private _audio1: HTMLAudioElement;
    private _audio2: HTMLAudioElement;
    private _source1: MediaElementAudioSourceNode;
    private _source2: MediaElementAudioSourceNode;
    private _gain1: GainNode;
    private _gain2: GainNode;
    private _analyser: AnalyserNode;
    private _audioContext: AudioContext;

    private _playbackFinished: Subject<void> = new Subject<void>();
    private _playbackFailed: Subject<string> = new Subject<string>();
    private _playingPreloadedTrack: Subject<TrackModel> = new Subject<TrackModel>();

    private _currentTrack: TrackModel | undefined;
    private _preloadedTrack: TrackModel | undefined;
    private _isPlaying: boolean = false;
    private _isPaused: boolean = false;
    private _activePlayer: 1 | 2 = 1;
    private _isCrossfading: boolean = false;

    private _targetVolume: number = 1;
    private _crossfadeCheckInterval: any | undefined;

    public constructor(
        private mathExtensions: MathExtensions,
        private logger: Logger,
        private settings: SettingsBase,
    ) {
        const audioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this._audioContext = new audioContextClass();
        this._analyser = this._audioContext.createAnalyser();
        this._analyser.fftSize = 128;
        this._analyser.connect(this._audioContext.destination);

        // Player 1
        this._audio1 = new Audio();
        this._audio1.crossOrigin = 'anonymous';
        this._source1 = this._audioContext.createMediaElementSource(this._audio1);
        this._gain1 = this._audioContext.createGain();
        this._source1.connect(this._gain1);
        this._gain1.connect(this._analyser);

        // Player 2
        this._audio2 = new Audio();
        this._audio2.crossOrigin = 'anonymous';
        this._source2 = this._audioContext.createMediaElementSource(this._audio2);
        this._gain2 = this._audioContext.createGain();
        this._source2.connect(this._gain2);
        this._gain2.connect(this._analyser);

        this.setupEventListeners(this._audio1, 1);
        this.setupEventListeners(this._audio2, 2);

        this.startCrossfadeMonitor();
    }

    public playbackFinished$: Observable<void> = this._playbackFinished.asObservable();
    public playbackFailed$: Observable<string> = this._playbackFailed.asObservable();
    public playingPreloadedTrack$: Observable<TrackModel> = this._playingPreloadedTrack.asObservable();

    public get analyser(): AnalyserNode {
        return this._analyser;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get progressSeconds(): number {
        return this.activeAudio.currentTime;
    }

    public get totalSeconds(): number {
        return isNaN(this.activeAudio.duration) ? 0 : this.activeAudio.duration;
    }

    private get activeAudio(): HTMLAudioElement {
        return this._activePlayer === 1 ? this._audio1 : this._audio2;
    }

    private get inactiveAudio(): HTMLAudioElement {
        return this._activePlayer === 1 ? this._audio2 : this._audio1;
    }

    private get activeGain(): GainNode {
        return this._activePlayer === 1 ? this._gain1 : this._gain2;
    }

    private get inactiveGain(): GainNode {
        return this._activePlayer === 1 ? this._gain2 : this._gain1;
    }

    public async playAsync(track: TrackModel): Promise<void> {
        this.logger.info(`Starting playback for: ${track.path}`, 'GaplessAudioPlayer', 'playAsync');
        
        // If we are crossfading, stop it and reset gains
        this._isCrossfading = false;
        this._gain1.gain.cancelScheduledValues(this._audioContext.currentTime);
        this._gain2.gain.cancelScheduledValues(this._audioContext.currentTime);

        this._currentTrack = track;
        const playableAudioFilePath: string = PathUtils.createPlayableAudioFilePath(track.path);

        const audio = this.activeAudio;
        audio.src = playableAudioFilePath;
        
        // Reset volumes based on current settings
        this.activeGain.gain.setTargetAtTime(this._targetVolume, this._audioContext.currentTime, 0.01);
        this.inactiveGain.gain.setTargetAtTime(0, this._audioContext.currentTime, 0.01);

        if (this._audioContext.state === 'suspended') {
            await this._audioContext.resume();
        }

        try {
            await audio.play();
            this._isPlaying = true;
            this._isPaused = false;
        } catch (e) {
            // Only report error if we are still trying to play this track
            if (this._isPlaying && this._currentTrack === track) {
                this.logger.error(e, `Could not play audio: ${playableAudioFilePath}`, 'GaplessAudioPlayer', 'playAsync');
                this._playbackFailed.next(playableAudioFilePath);
            }
        }
    }

    public stop(): void {
        this._isPlaying = false;
        this._isPaused = false;
        this._isCrossfading = false;
        this._audio1.pause();
        this._audio1.src = '';
        this._audio2.pause();
        this._audio2.src = '';
        this._gain1.gain.setTargetAtTime(0, this._audioContext.currentTime, 0.01);
        this._gain2.gain.setTargetAtTime(0, this._audioContext.currentTime, 0.01);
    }

    public async startPausedAsync(track: TrackModel, skipSeconds: number): Promise<void> {
        await this.playAsync(track);
        this.activeAudio.currentTime = skipSeconds;
        this.pause();
    }

    public pause(): void {
        this._isPaused = true;
        this.activeAudio.pause();
    }

    public async resumeAsync(): Promise<void> {
        try {
            await this.activeAudio.play();
            this._isPaused = false;
        } catch (e) {
            this.logger.error(e, 'Could not resume audio', 'GaplessAudioPlayer', 'resumeAsync');
        }
    }

    public setVolume(linearVolume: number): void {
        this._targetVolume = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;
        if (!this._isCrossfading) {
            this.activeGain.gain.setTargetAtTime(this._targetVolume, this._audioContext.currentTime, 0.01);
            this.inactiveGain.gain.setTargetAtTime(0, this._audioContext.currentTime, 0.01);
        }
    }

    public async skipToSecondsAsync(seconds: number): Promise<void> {
        this.activeAudio.currentTime = seconds;
        return Promise.resolve();
    }

    public preloadNext(track: TrackModel): void {
        this.logger.info(`Preloading next track: ${track.path}`, 'GaplessAudioPlayer', 'preloadNext');
        this._preloadedTrack = track;
        const playableAudioFilePath: string = PathUtils.createPlayableAudioFilePath(track.path);
        
        const audio = this.inactiveAudio;
        audio.src = playableAudioFilePath;
        audio.preload = 'auto';
        audio.load();
        this.inactiveGain.gain.setTargetAtTime(0, this._audioContext.currentTime, 0.01);
    }

    private setupEventListeners(audio: HTMLAudioElement, id: number): void {
        audio.onended = () => {
            if (this._activePlayer === id && !this._isCrossfading) {
                this._playbackFinished.next();
            }
        };

        audio.onerror = (e) => {
            if (this._activePlayer === id && this._isPlaying && audio.src) {
                const error = audio.error;
                const errorMessage = error ? `code=${error.code} message=${error.message}` : 'Unknown error';
                this.logger.error(error, `Audio player ${id} error: ${errorMessage}`, 'GaplessAudioPlayer', 'setupEventListeners');
                this._playbackFailed.next(audio.src);
            }
        };
    }

    private startCrossfadeMonitor(): void {
        if (this._crossfadeCheckInterval) {
            clearInterval(this._crossfadeCheckInterval as any);
        }

        this._crossfadeCheckInterval = setInterval(() => {
            if (!this._isPlaying || this._isPaused || this._isCrossfading || !this._preloadedTrack) {
                return;
            }

            const audio = this.activeAudio;
            if (isNaN(audio.duration) || audio.duration === 0) {
                return;
            }

            const remainingTime = audio.duration - audio.currentTime;
            const crossfadeDuration = this.settings.useCrossfade ? this.settings.crossfadeDuration : 0.1; // 0.1s for gapless

            if (remainingTime <= crossfadeDuration) {
                this.performCrossfade(crossfadeDuration);
            }
        }, 100);
    }

    private performCrossfade(duration: number): void {
        if (this._isCrossfading || !this._preloadedTrack) {
            return;
        }

        this._isCrossfading = true;
        const oldPlayerId = this._activePlayer;
        const nextTrack = this._preloadedTrack!;
        
        const outgoingGain = oldPlayerId === 1 ? this._gain1 : this._gain2;
        const incomingGain = oldPlayerId === 1 ? this._gain2 : this._gain1;
        const incomingAudio = oldPlayerId === 1 ? this._audio2 : this._audio1;

        this.logger.info(`Starting overlapping crossfade to: ${nextTrack.path} over ${duration}s`, 'GaplessAudioPlayer', 'performCrossfade');

        // Swap active player state immediately so visualizers/progress use the new one
        this._activePlayer = oldPlayerId === 1 ? 2 : 1;

        // Iniciar a próxima música
        incomingAudio.play().then(() => {
            const now = this._audioContext.currentTime;
            
            // Crossfade: Diminuir som da atual e aumentar da nova simultaneamente
            outgoingGain.gain.cancelScheduledValues(now);
            outgoingGain.gain.setValueAtTime(outgoingGain.gain.value, now);
            outgoingGain.gain.linearRampToValueAtTime(0, now + duration);

            incomingGain.gain.cancelScheduledValues(now);
            incomingGain.gain.setValueAtTime(0, now);
            incomingGain.gain.linearRampToValueAtTime(this._targetVolume, now + duration);
            
            // Notificar o serviço de playback que a faixa mudou
            this._playingPreloadedTrack.next(nextTrack);
            this._currentTrack = nextTrack;
            this._preloadedTrack = undefined;

            setTimeout(() => {
                this._isCrossfading = false;
                // Pausar e limpar o player antigo APENAS se ele não for o ativo agora
                if (oldPlayerId === 1) {
                    if (this._activePlayer !== 1) {
                        this._audio1.pause();
                        this._audio1.src = '';
                    }
                } else {
                    if (this._activePlayer !== 2) {
                        this._audio2.pause();
                        this._audio2.src = '';
                    }
                }
            }, (duration * 1000) + 100);
        }).catch(e => {
            this.logger.error(e, 'Failed to start incoming audio during crossfade', 'GaplessAudioPlayer', 'performCrossfade');
            this._isCrossfading = false;
            this._playbackFinished.next();
        });
    }

    private get activePlayerId(): 1 | 2 {
        return this._activePlayer;
    }

    public getAudio(): HTMLAudioElement | undefined {
        return this.activeAudio;
    }
}
