import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AudioChangedEvent } from './audio-changed-event';
import { IAudioPlayer } from './i-audio-player';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { StringUtils } from '../../../common/utils/string-utils';
import { TrackModel } from '../../track/track-model';

@Injectable({
    providedIn: 'root',
})
export class GaplessAudioPlayer implements IAudioPlayer {
    private _audio: HTMLAudioElement;
    private _tempAudio: HTMLAudioElement;
    private _audioChanged: Subject<AudioChangedEvent> = new Subject();
    private _playbackFinished: Subject<void> = new Subject();
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
    private shouldPauseAfterStarting: boolean = false;
    private skipSecondsAfterStarting: number = 0;
    private _lastSetLogarithmicVolume: number = 0;
    private _analyser: AnalyserNode;

    public constructor(
        private mathExtensions: MathExtensions,
        private logger: Logger,
    ) {
        this._audio = new Audio();
        this._audioContext = new AudioContext();
        this._gainNode = this._audioContext.createGain();
        this._gainNode.connect(this._audioContext.destination);

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
        this._audio.muted = false;
    }

    public audioChanged$: Observable<AudioChangedEvent> = this._audioChanged.asObservable();
    public playbackFinished$: Observable<void> = this._playbackFinished.asObservable();
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
                return this._audioContext.currentTime - this._audioStartTime;
            }
        } else {
            return 0;
        }
    }

    public get totalSeconds(): number {
        return this._isPlaying ? this._currentBuffer?.duration || 0 : 0;
    }

    public play(track: TrackModel): void {
        this._currentTrack = track;
        const playableAudioFilePath: string = this.replaceUnplayableCharacters(track.path);
        this.loadAudioWithWebAudioAsync(playableAudioFilePath, false);

        this._tempAudio = new Audio();
        this._tempAudio.volume = 0;
        this._tempAudio.muted = false;
        this._tempAudio.src = 'file:///' + playableAudioFilePath;
    }
    public stop(): void {
        this._isPlaying = false;

        if (this._sourceNode) {
            this._sourceNode.onended = () => {};
            this._sourceNode.stop();
            this._sourceNode.disconnect();
        }

        this._audio.currentTime = 0;
        this._audio.pause();
    }

    public startPaused(track: TrackModel, skipSeconds: number): void {
        this.shouldPauseAfterStarting = true;
        this.skipSecondsAfterStarting = skipSeconds;
        this._gainNode.gain.setValueAtTime(0, 0);
        this.play(track);
    }

    public pause(): void {
        this._isPaused = true;
        this._audioPausedAt = this._audioContext.currentTime - this._audioStartTime;

        if (this._sourceNode) {
            this._sourceNode.onended = () => {};
            this._sourceNode.stop();
            this._sourceNode.disconnect();
        }

        this._audio.pause();
    }
    public resume(): void {
        this.playWebAudio(this._audioPausedAt);
        this._audio.play();
        this._isPaused = false;
    }
    public setVolume(linearVolume: number): void {
        // log(0) is undefined. So we provide a minimum of 0.01.
        const logarithmicVolume: number = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;
        this._gainNode.gain.setValueAtTime(logarithmicVolume, 0);
        this._lastSetLogarithmicVolume = logarithmicVolume;
    }
    public skipToSeconds(seconds: number): void {
        const isPaused = this._isPaused;
        this.playWebAudio(seconds);
        this._audio.currentTime = seconds;

        if (isPaused) {
            this.pause();
        }
    }
    public preloadNext(track: TrackModel): void {
        this._preloadedTrack = track;
        const playableAudioFilePath: string = this.replaceUnplayableCharacters(track.path);
        this.loadAudioWithWebAudioAsync(playableAudioFilePath, true);
    }

    private async fetchAudioFile(url: string): Promise<Blob> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }
        return await response.blob(); // Convert the response to a Blob
    }

    private playWebAudio(offset: number): void {
        if (!this._currentBuffer) {
            return;
        }

        try {
            // Make sure to stop any previous sourceNode if it's still playing
            if (this._sourceNode) {
                this._sourceNode.onended = () => {};

                this._sourceNode.stop();
                this._sourceNode.disconnect(); // Disconnect the previous node to avoid issues
            }

            // Create a new buffer source node
            this._sourceNode = this._audioContext.createBufferSource();
            this._sourceNode.buffer = this._currentBuffer;

            // Connect the source to the analyser
            this._sourceNode.connect(this._analyser);

            // Connect the source node to the gain node
            this._sourceNode.connect(this._gainNode);

            this._sourceNode.onended = () => {
                if (
                    this._nextBuffer &&
                    this._preloadedTrack &&
                    this._currentTrack &&
                    this._preloadedTrack.number === this._currentTrack.number + 1
                ) {
                    this.transitionToNextBuffer();
                    this._playingPreloadedTrack.next(this._preloadedTrack);
                    this._currentTrack = this._preloadedTrack;
                    this._preloadedTrack = undefined;
                } else {
                    this._playbackFinished.next();
                }
            };

            // Store the current time when audio starts playing
            this._audioStartTime = this._audioContext.currentTime - offset;

            // Sync playback position with HTML5 Audio
            this._sourceNode.start(0, offset);

            this._audio = this._tempAudio;
            this._audio.play();

            this._isPlaying = true;
            this._isPaused = false;

            if (this.shouldPauseAfterStarting) {
                this.pause();
                this.skipToSeconds(this.skipSecondsAfterStarting);
                this.shouldPauseAfterStarting = false;
                this.skipSecondsAfterStarting = 0;
                this._gainNode.gain.setValueAtTime(this._lastSetLogarithmicVolume, 0);
            }
        } catch (error) {}
    }

    private transitionToNextBuffer(): void {
        if (!this._nextBuffer) {
            return;
        }

        this._currentBuffer = this._nextBuffer;
        this._nextBuffer = undefined;

        this.playWebAudio(0);
    }

    private async loadAudioWithWebAudioAsync(audioFilePath: string, preload: boolean): Promise<void> {
        this.fetchAudioFile(audioFilePath)
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = async () => {
                    const arrayBuffer = reader.result as ArrayBuffer;

                    if (preload) {
                        this._nextBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
                    } else {
                        this._currentBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
                        this.playWebAudio(0);
                    }
                };
            })
            .catch((error) => console.error(error));
    }

    private replaceUnplayableCharacters(audioFilePath: string): string {
        // HTMLAudioElement doesn't play paths which contain # and ?, so we escape them.
        let playableAudioFilePath: string = StringUtils.replaceAll(audioFilePath, '#', '%23');
        playableAudioFilePath = StringUtils.replaceAll(playableAudioFilePath, '?', '%3F');
        return playableAudioFilePath;
    }

    public getAudio(): HTMLAudioElement | undefined {
        return undefined;
    }
}
