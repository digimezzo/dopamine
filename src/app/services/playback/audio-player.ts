import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../common/logger';
import { BaseAudioPlayer } from './base-audio-player';

@Injectable()
export class AudioPlayer implements BaseAudioPlayer {
    private audio: HTMLAudioElement;

    constructor(private logger: Logger) {
        this.audio = new Audio();

        try {
            // This fails during unit tests because setSinkId() does not exist on HTMLAudioElement
            // @ts-ignore
            this.audio.setSinkId('default');
        } catch (e) {
            // Suppress this error, but log it, in case it happens in production.
            this.logger.error(`Could not perform setSinkId(). Error: ${e.message}`, 'AudioPlayer', 'constructor');
        }

        this.audio.defaultPlaybackRate = 1;
        this.audio.playbackRate = 1;
        this.audio.volume = 1;
        this.audio.muted = false;

        this.audio.onended = () => this.playbackFinished.next();
    }

    private playbackFinished: Subject<void> = new Subject();
    public playbackFinished$: Observable<void> = this.playbackFinished.asObservable();

    public get progressSeconds(): number {
        if (isNaN(this.audio.currentTime)) {
            return 0;
        }

        return this.audio.currentTime;
    }

    public get totalSeconds(): number {
        if (isNaN(this.audio.duration)) {
            return 0;
        }

        return this.audio.duration;
    }

    public play(audioFilePath: string): void {
        // HTMLAudioElement doesn't play paths which contain a #, so we escape it by replacing it with %23.
        const playableAudioFilePath: string = audioFilePath.replace('#', '%23');
        this.audio.src = 'file:///' + playableAudioFilePath;
        this.audio.play();
    }

    public stop(): void {
        this.audio.pause();
    }

    public pause(): void {
        this.audio.pause();
    }

    public resume(): void {
        this.audio.play();
    }

    public setVolume(volume: number): void {
        this.audio.volume = volume;
    }

    public mute(): void {
        this.audio.muted = true;
    }
    public unMute(): void {
        this.audio.muted = false;
    }

    public skipToSeconds(seconds: number): void {
        this.audio.currentTime = seconds;
    }
}
