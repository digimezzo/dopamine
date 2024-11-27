import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AudioChangedEvent } from './audio-changed-event';
import { IAudioPlayer } from './i-audio-player';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';
import { StringUtils } from '../../../common/utils/string-utils';

@Injectable({
    providedIn: 'root',
})
export class GaplessAudioPlayer implements IAudioPlayer {
    private _audioChanged: Subject<AudioChangedEvent> = new Subject();
    private _playbackFinished: Subject<void> = new Subject();
    private _audioContext: AudioContext;
    private _audioStartTime: number = 0;
    private _audioPausedAt: number = 0;
    private _buffer: AudioBuffer | undefined;
    private _sourceNode: AudioBufferSourceNode | undefined;
    private _gainNode: GainNode;

    public constructor(
        private mathExtensions: MathExtensions,
        private logger: Logger,
    ) {
        this._audioContext = new AudioContext();
        this._gainNode = this._audioContext.createGain();
        this._gainNode.connect(this._audioContext.destination);

        this._gainNode.gain.setValueAtTime(1, 0);
    }

    public audioChanged$: Observable<AudioChangedEvent> = this._audioChanged.asObservable();
    public playbackFinished$: Observable<void> = this._playbackFinished.asObservable();

    public get progressSeconds(): number {
        return this._audioContext.currentTime - this._audioStartTime;
    }

    public get totalSeconds(): number {
        return this._buffer?.duration || 0;
    }

    public play(audioFilePath: string): void {
        const playableAudioFilePath: string = this.replaceUnplayableCharacters(audioFilePath);
        this.loadAudioWithWebAudioAsync(playableAudioFilePath);
    }
    public stop(): void {
        if (this._sourceNode) {
            this._sourceNode.onended = () => {};
            this._sourceNode.stop();
            this._sourceNode.disconnect();
        }
    }
    public pause(): void {
        this._audioPausedAt = this._audioContext.currentTime - this._audioStartTime;

        if (this._sourceNode) {
            this._sourceNode.onended = () => {};
            this._sourceNode.stop();
            this._sourceNode.disconnect();
        }
    }
    public resume(): void {
        this.playWebAudio(this._audioPausedAt);
    }
    public setVolume(linearVolume: number): void {
        // log(0) is undefined. So we provide a minimum of 0.01.
        const logarithmicVolume: number = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;
        this._gainNode.gain.setValueAtTime(logarithmicVolume, 0);
    }
    public skipToSeconds(seconds: number): void {
        this.playWebAudio(seconds);
    }
    public preloadNextTrack(audioFilePath: string): void {
        // Do nothing
    }

    private async fetchAudioFile(url: string): Promise<Blob> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }
        return await response.blob(); // Convert the response to a Blob
    }

    private playWebAudio(offset: number): void {
        if (!this._buffer) {
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
            this._sourceNode.buffer = this._buffer;

            // Connect the source to the analyser
            // this._sourceNode.connect(this._analyser);

            // Connect the source node to the gain node
            this._sourceNode.connect(this._gainNode);

            this._sourceNode.onended = () => {
                this._playbackFinished.next();
            };

            // Store the current time when audio starts playing
            this._audioStartTime = this._audioContext.currentTime - offset;

            // Sync playback position with HTML5 Audio
            this._sourceNode.start(0, offset);
        } catch (error) {}
    }

    private async loadAudioWithWebAudioAsync(audioFilePath: string): Promise<void> {
        this.fetchAudioFile(audioFilePath)
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = async () => {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    this._buffer = await this._audioContext.decodeAudioData(arrayBuffer);
                    this.playWebAudio(0);
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
}
