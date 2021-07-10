import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseAudioPlayer } from './base-audio-player';
import { PlaybackProgress } from './playback-progress';

@Injectable()
export class ProgressUpdater {
    private interval: number;
    private progressChanged: Subject<PlaybackProgress> = new Subject();

    constructor(private audioPlayer: BaseAudioPlayer) {}

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();

    public startUpdatingProgress(): void {
        this.interval = window.setInterval(() => {
            this.progressChanged.next(new PlaybackProgress(this.audioPlayer.progressSeconds, this.audioPlayer.totalSeconds));
        }, 500);
    }

    public stopUpdatingProgress(): void {
        this.pauseUpdatingProgress();
        this.progressChanged.next(new PlaybackProgress(0, 0));
    }

    public pauseUpdatingProgress(): void {
        clearInterval(this.interval);
    }
}
