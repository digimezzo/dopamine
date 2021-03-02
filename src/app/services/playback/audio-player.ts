import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';
import { Observable, Subject } from 'rxjs';
import { BaseAudioPlayer } from './base-audio-player';

@Injectable({
    providedIn: 'root',
})
export class AudioPlayer implements BaseAudioPlayer {
    private sound: Howl;

    private playbackFinished: Subject<void> = new Subject();
    public playbackFinished$: Observable<void> = this.playbackFinished.asObservable();

    public get progressSeconds(): number {
        if (this.sound != undefined) {
            return this.sound.seek();
        }

        return 0;
    }

    public get totalSeconds(): number {
        if (this.sound != undefined) {
            return this.sound.duration();
        }

        return 0;
    }

    public play(audioFilePath: string): void {
        this.sound = new Howl({
            src: [audioFilePath],
            onend: () => {
                this.playbackFinished.next();
            },
        });

        this.sound.play();
    }

    public stop(): void {
        if (this.sound != undefined) {
            this.sound.stop();
        }
    }

    public pause(): void {
        if (this.sound != undefined) {
            this.sound.pause();
        }
    }

    public resume(): void {
        if (this.sound != undefined) {
            this.sound.play();
        }
    }

    public setVolume(volume: number): void {
        Howler.volume(volume);
    }

    public mute(): void {
        if (this.sound != undefined) {
            this.sound.muted(true);
        }
    }
    public unMute(): void {
        if (this.sound != undefined) {
            this.sound.muted(false);
        }
    }

    public skipToSeconds(seconds: number): void {
        if (this.sound != undefined) {
            this.sound.seek(seconds);
        }
    }
}
