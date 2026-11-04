import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IAudioPlayer } from './i-audio-player';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { TrackModel } from '../../track/track-model';
import { PathUtils } from '../../../common/utils/path-utils';
import { AudioEqualizer } from './audio-equalizer';
import { EqualizerServiceBase } from '../../equalizer/equalizer.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';

@Injectable({
    providedIn: 'root',
})
export class GaplessAudioPlayer implements IAudioPlayer {
    private _audio: HTMLAudioElement;
    private _tempAudio: HTMLAudioElement = new Audio();
    private _playbackFinished: Subject<void> = new Subject();
    private _playbackFailed: Subject<string> = new Subject();

    private _playingPreloadedTrack: Subject<TrackModel> = new Subject();
    private _audioContext: AudioContext;
    private _audioStartTime: number = 0;
    private _audioPausedAt: number = 0;
    private _currentBuffer: AudioBuffer | undefined;
    private _nextBuffer: AudioBuffer | undefined;
    private _sourceNode: AudioBufferSourceNode | undefined;
    private _gainNode: GainNode;
    private _currentTrack: TrackModel | undefined;
    private _preloadedTrack: TrackModel | undefined;
    private _isPlaying: boolean = false;
    private _isPaused: boolean = false;
    private _isLoading: boolean = false;
    private _loadRequestId: number = 0;
    private skipSecondsAfterStarting: number = 0;
    private _playbackRate: number = 1;
    private _analyser: AnalyserNode;
    private _equalizer: AudioEqualizer;

    public constructor(
        private mathExtensions: MathExtensions,
        private equalizerService: EqualizerServiceBase,
        private logger: Logger,
        private settings: SettingsBase,
    ) {
        this._audio = new Audio();
        this._audioContext = new AudioContext();
        this._gainNode = this._audioContext.createGain();

        this._equalizer = new AudioEqualizer(this._audioContext);
        this._gainNode.connect(this._equalizer.input);
        this._equalizer.output.connect(this._audioContext.destination);
        this.equalizerService.register(this._equalizer);

        this._analyser = this._audioContext.createAnalyser();
        this._analyser.fftSize = 128;

        this._gainNode.gain.setValueAtTime(1, 0);

        try {
            // This fails during unit tests because setSinkId() does not exist on HTMLAudioElement
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this._audio.setSinkId('default');
        } catch (e: unknown) {
            // Suppress this error, but log it, in case it happens in production.
            this.logger.error(e, 'Could not perform setSinkId()', 'AudioPlayer', 'constructor');
        }
        this._audio.volume = 0;
        this._audio.defaultPlaybackRate = 1;
        this._audio.playbackRate = 1;
        this._audio.muted = false;

        this.setAudioOutputDeviceAsync(this.settings.preferredAudioOutputDeviceId);
    }

    public async setAudioOutputDeviceAsync(deviceId: string): Promise<void> {
        try {
            // setSinkId() on AudioContext is not yet part of the TS lib.dom typings.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            await (this._audioContext as any).setSinkId(deviceId || 'default');
        } catch (e: unknown) {
            this.logger.error(e, `Could not set audio output device '${deviceId}'`, 'GaplessAudioPlayer', 'setAudioOutputDeviceAsync');
        }
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
        if (this._isPlaying) {
            if (this._isPaused) {
                return this._audioPausedAt;
            } else {
                return (this._audioContext.currentTime - this._audioStartTime) * this._playbackRate;
            }
        } else {
            return 0;
        }
    }

    public get totalSeconds(): number {
        return this._isPlaying ? (this._currentBuffer?.duration ?? 0) : 0;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async playAsync(track: TrackModel): Promise<void> {
        this._currentTrack = track;
        this._isPaused = false;
        const playableAudioFilePath: string = PathUtils.createPlayableAudioFilePath(track.path);

        this._tempAudio = new Audio();
        this._tempAudio.volume = 0;
        this._tempAudio.defaultPlaybackRate = this._playbackRate;
        this._tempAudio.playbackRate = this._playbackRate;
        this._tempAudio.muted = false;
        this._tempAudio.src = playableAudioFilePath;

        this.loadAudioWithWebAudio(playableAudioFilePath, false);
    }
    public stop(): void {
        this._isPlaying = false;
        this.cancelPendingLoad();

        if (this._sourceNode) {
            this._sourceNode.onended = () => {
                // Intentionally left blank
            };

            this._sourceNode.stop();
            this._sourceNode.disconnect();
        }

        this._audio.currentTime = 0;
        this._audio.pause();
    }

    public async startPausedAsync(track: TrackModel, skipSeconds: number): Promise<void> {
        this.skipSecondsAfterStarting = skipSeconds;
        await this.playAsync(track);
        this._isPaused = true;
    }

    public pause(): void {
        // While the track is still being decoded, it will be prepared in a paused state once decoding completes.
        if (!this._isLoading) {
            this._audioPausedAt = this.progressSeconds;
        }

        this._isPaused = true;

        if (this._sourceNode) {
            this._sourceNode.onended = () => {
                // Intentionally left blank
            };

            this._sourceNode.stop();
            this._sourceNode.disconnect();
        }

        this._audio.pause();
    }
    public async resumeAsync(): Promise<void> {
        if (this._isLoading) {
            // The track is still being decoded. It will start playing once decoding completes.
            this._isPaused = false;
            return;
        }

        await this.playWebAudioAsync(this._audioPausedAt);
        await this._audio.play();
        this._isPaused = false;
    }
    public setVolume(linearVolume: number, replayGainMultiplier: number = 1): void {
        // log(0) is undefined. So we provide a minimum of 0.01.
        const logarithmicVolume: number = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;
        const finalGain: number = logarithmicVolume * replayGainMultiplier;
        this._gainNode.gain.setValueAtTime(finalGain, 0);
    }

    public setPlaybackRate(rate: number): void {
        const progressSeconds: number = this.progressSeconds;
        this._playbackRate = rate;
        this._audio.defaultPlaybackRate = rate;
        this._audio.playbackRate = rate;
        this._tempAudio.defaultPlaybackRate = rate;
        this._tempAudio.playbackRate = rate;

        if (this._sourceNode) {
            this._sourceNode.playbackRate.setValueAtTime(rate, this._audioContext.currentTime);
            this._audioStartTime = this._audioContext.currentTime - progressSeconds / rate;
        }
    }
    public async skipToSecondsAsync(seconds: number): Promise<void> {
        if (this._isLoading) {
            this.skipSecondsAfterStarting = seconds;
            return;
        }

        const isPaused = this._isPaused;
        await this.playWebAudioAsync(seconds);
        this._audio.currentTime = seconds;

        if (isPaused) {
            this.pause();
            this._audioPausedAt = seconds;
        }
    }

    public preloadNext(track: TrackModel): void {
        this._preloadedTrack = track;
        const playableAudioFilePath: string = PathUtils.createPlayableAudioFilePath(track.path);
        this.loadAudioWithWebAudio(playableAudioFilePath, true);
    }

    private async fetchAudioFile(url: string): Promise<Blob> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }
        return await response.blob(); // Convert the response to a Blob
    }

    private async playWebAudioAsync(offset: number): Promise<void> {
        if (!this._currentBuffer) {
            return;
        }

        try {
            // Make sure to stop any previous sourceNode if it's still playing
            if (this._sourceNode) {
                this._sourceNode.onended = () => {
                    // Intentionally left blank
                };

                this._sourceNode.stop();
                this._sourceNode.disconnect(); // Disconnect the previous node to avoid issues
            }

            // Create a new buffer source node
            this._sourceNode = this._audioContext.createBufferSource();
            this._sourceNode.buffer = this._currentBuffer;
            this._sourceNode.playbackRate.setValueAtTime(this._playbackRate, this._audioContext.currentTime);

            // Connect the source to the analyser
            this._sourceNode.connect(this._analyser);

            // Connect the source node to the gain node
            this._sourceNode.connect(this._gainNode);

            this._sourceNode.onended = async () => {
                if (
                    this._nextBuffer &&
                    this._preloadedTrack &&
                    this._currentTrack &&
                    this._preloadedTrack.number === this._currentTrack.number + 1
                ) {
                    await this.transitionToNextBufferAsync();
                    this._playingPreloadedTrack.next(this._preloadedTrack);
                    this._currentTrack = this._preloadedTrack;
                    this._preloadedTrack = undefined;
                } else {
                    this._playbackFinished.next();
                }
            };

            // Store the current time when audio starts playing
            this._audioStartTime = this._audioContext.currentTime - offset / this._playbackRate;

            // Sync playback position with HTML5 Audio
            this._sourceNode.start(0, offset);

            this._isPlaying = true;
            this._isPaused = false;

            this._audio = this._tempAudio;

            try {
                await this._audio.play();
            } catch (e: unknown) {
                // The HTML5 Audio is only used for media session integration. Its play() gets aborted when pause() is called
                // before it resolves, which is expected and must not affect Web Audio playback.
                this.logger.warn(`Could not play HTML5 Audio: ${String(e)}`, 'GaplessAudioPlayer', 'playWebAudio');
            }
        } catch (e) {
            this.logger.error(e, `Could not play with web audio`, 'GaplessAudioPlayer', 'playWebAudio');
        }
    }

    private async transitionToNextBufferAsync(): Promise<void> {
        if (!this._nextBuffer) {
            return;
        }

        this._currentBuffer = this._nextBuffer;
        this._nextBuffer = undefined;

        await this.playWebAudioAsync(0);
    }

    private loadAudioWithWebAudio(audioFilePath: string, preload: boolean): void {
        const loadRequestId: number = preload ? this._loadRequestId : ++this._loadRequestId;

        if (!preload) {
            this._isLoading = true;
        }

        this.fetchAudioFile(audioFilePath)
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = async () => {
                    const arrayBuffer = reader.result as ArrayBuffer;

                    try {
                        if (preload) {
                            this._nextBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
                        } else {
                            const decodedBuffer: AudioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);

                            if (loadRequestId !== this._loadRequestId) {
                                // A newer track was requested, or playback was stopped, while this one was loading.
                                return;
                            }

                            this._currentBuffer = decodedBuffer;
                            this._isLoading = false;

                            const offset: number = this.skipSecondsAfterStarting;
                            this.skipSecondsAfterStarting = 0;

                            if (this._isPaused) {
                                this.prepareTrackPaused(offset);
                            } else {
                                await this.playWebAudioAsync(offset);
                            }
                        }
                    } catch (e: unknown) {
                        if (!preload) {
                            if (loadRequestId !== this._loadRequestId) {
                                return;
                            }

                            this._isLoading = false;
                            this.skipSecondsAfterStarting = 0;
                        }

                        this.logger.error(e, `Could not decode audio data`, 'GaplessAudioPlayer', 'loadAudioWithWebAudio');
                        this._playbackFailed.next(audioFilePath);
                    }
                };
            })
            .catch((e: unknown) => {
                if (!preload && loadRequestId === this._loadRequestId) {
                    this._isLoading = false;
                    this.skipSecondsAfterStarting = 0;
                }

                this.logger.error(e, `Could not load with web audio`, 'GaplessAudioPlayer', 'loadAudioWithWebAudio');
            });
    }

    private prepareTrackPaused(offset: number): void {
        if (this._sourceNode) {
            this._sourceNode.onended = () => {
                // Intentionally left blank
            };

            this._sourceNode.stop();
            this._sourceNode.disconnect();
            this._sourceNode = undefined;
        }

        this._audio.pause();
        this._audio = this._tempAudio;
        this._audio.currentTime = offset;

        this._audioPausedAt = offset;
        this._isPlaying = true;
        this._isPaused = true;
    }

    private cancelPendingLoad(): void {
        this._loadRequestId++;
        this._isLoading = false;
        this.skipSecondsAfterStarting = 0;
    }

    public getAudio(): HTMLAudioElement | undefined {
        return undefined;
    }
}
