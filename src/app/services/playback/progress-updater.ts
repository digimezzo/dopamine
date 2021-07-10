import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseAudioPlayer } from './base-audio-player';
import { PlaybackProgress } from './playback-progress';

@Injectable()
export class ProgressUpdater {
    private interval: number;
    private shouldReportProgress: boolean = false;
    private progressChanged: Subject<PlaybackProgress> = new Subject();

    constructor(private audioPlayer: BaseAudioPlayer) {}

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();

    public startUpdatingProgress(): void {
        this.shouldReportProgress = true;

        this.interval = window.setInterval(() => {
            this.reportProgress();
        }, 500);
    }

    public stopUpdatingProgress(): void {
        this.pauseUpdatingProgress();
        this.progressChanged.next(new PlaybackProgress(0, 0));
    }

    public pauseUpdatingProgress(): void {
        this.shouldReportProgress = false;
        clearInterval(this.interval);
    }

    private reportProgress(): void {
        if (this.shouldReportProgress) {
            this.progressChanged.next(new PlaybackProgress(this.audioPlayer.progressSeconds, this.audioPlayer.totalSeconds));
        }
    }
}
