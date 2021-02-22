import { Howl, Howler } from 'howler';
import { Observable, Subject } from 'rxjs';
import { BaseAudioPlayer } from './base-audio-player';

export class AudioPlayer implements BaseAudioPlayer {
    private sound: Howl;

    private playBackFinished: Subject<void> = new Subject();
    public playBackFinished$: Observable<void> = this.playBackFinished.asObservable();

    public get progressSeconds(): number {
        if (this.sound != undefined) {
            return this.sound.seek();
        }

        return 0;
    }

    public get progressPercent(): number {
        if (this.sound != undefined) {
            return (this.sound.seek() / this.sound.duration()) * 100;
        }

        return 0;
    }

    public play(audioFilePath: string): void {
        this.sound = new Howl({
            src: [audioFilePath],
            onend: () => {
                this.playBackFinished.next();
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
}
