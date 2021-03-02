import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseAudioPlayer } from './base-audio-player';

@Injectable()
export class AudioPlayerStub implements BaseAudioPlayer {
    private playbackFinished: Subject<void> = new Subject();
    public playbackFinished$: Observable<void> = this.playbackFinished.asObservable();
    public progressSeconds: number;
    public totalSeconds: number;

    public play(audioFilePath: string): void {}
    public stop(): void {}
    public pause(): void {}
    public resume(): void {}
    public setVolume(volume: number): void {}
    public mute(): void {}
    public unMute(): void {}
    public skipToSeconds(seconds: number): void {}
    public onPlaybackFinished(): void {
        this.playbackFinished.next();
    }
}
