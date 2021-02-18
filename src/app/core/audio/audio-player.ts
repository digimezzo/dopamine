import { Howl, Howler } from 'howler';
import { BaseAudioPlayer } from './base-audio-player';

export class AudioPlayer implements BaseAudioPlayer {
    private sound: Howl;

    public get progressPercent(): number {
        if (this.sound != undefined) {
            return (this.sound.seek() / this.sound.duration()) * 100;
        }

        return 0;
    }

    public play(audioFilePath: string): void {
        this.stop();

        this.sound = new Howl({
            src: [audioFilePath],
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
        this.sound.muted(true);
    }
    public unMute(): void {
        this.sound.muted(false);
    }
}
