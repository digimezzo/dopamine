import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { StringUtils } from '../../common/utils/string-utils';
import { AudioPlayerBase } from './audio-player.base';

@Injectable()
export class AudioPlayer implements AudioPlayerBase {
    private _audio: HTMLAudioElement;

    public constructor(
        private mathExtensions: MathExtensions,
        private logger: Logger,
    ) {
        this._audio = new Audio();

        try {
            // This fails during unit tests because setSinkId() does not exist on HTMLAudioElement
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.audio.setSinkId('default');
        } catch (e: unknown) {
            // Suppress this error, but log it, in case it happens in production.
            this.logger.error(e, 'Could not perform setSinkId()', 'AudioPlayer', 'constructor');
        }

        this.audio.defaultPlaybackRate = 1;
        this.audio.playbackRate = 1;
        this.audio.volume = 1;
        this.audio.muted = false;

        this.audio.onended = () => this.playbackFinished.next();
    }

    private playbackFinished: Subject<void> = new Subject();
    public playbackFinished$: Observable<void> = this.playbackFinished.asObservable();

    public get audio(): HTMLAudioElement {
        return this._audio;
    }

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
        const playableAudioFilePath: string = this.replaceUnplayableCharacters(audioFilePath);
        this.audio.src = 'file:///' + playableAudioFilePath;
        PromiseUtils.noAwait(this.audio.play());
    }

    public stop(): void {
        this.audio.currentTime = 0;
        this.audio.pause();
    }

    public pause(): void {
        this.audio.pause();
    }

    public resume(): void {
        PromiseUtils.noAwait(this.audio.play());
    }

    public setVolume(linearVolume: number): void {
        // log(0) is undefined. So we provide a minimum of 0.01.
        const logarithmicVolume: number = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;
        this.audio.volume = logarithmicVolume;
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

    private replaceUnplayableCharacters(audioFilePath: string): string {
        // HTMLAudioElement doesn't play paths which contain # and ?, so we escape them.
        let playableAudioFilePath: string = StringUtils.replaceAll(audioFilePath, '#', '%23');
        playableAudioFilePath = StringUtils.replaceAll(playableAudioFilePath, '?', '%3F');
        return playableAudioFilePath;
    }
}
