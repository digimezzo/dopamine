import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseAudioPlayer } from './base-audio-player';
import { PlaybackProgress } from './playback-progress';

@Injectable({
    providedIn: 'root',
})
export class ProgressUpdater {
    private progressRequestId: number;
    private progressChanged: Subject<PlaybackProgress> = new Subject();

    constructor(private audioPlayer: BaseAudioPlayer) {}

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();

    public startUpdatingProgress(): void {
        if (this.progressRequestId == undefined) {
            this.progressRequestId = requestAnimationFrame(this.updateProgress.bind(this));
        }
    }

    public stopUpdatingProgress(): void {
        if (this.progressRequestId != undefined) {
            cancelAnimationFrame(this.progressRequestId);
            this.progressRequestId = undefined;
        }

        this.progressChanged.next(new PlaybackProgress(0, 0));
    }

    public pauseUpdatingProgress(): void {
        if (this.progressRequestId != undefined) {
            cancelAnimationFrame(this.progressRequestId);
            this.progressRequestId = undefined;
        }
    }

    private updateProgress(): void {
        this.progressRequestId = undefined;
        this.progressChanged.next(new PlaybackProgress(this.audioPlayer.progressSeconds, this.audioPlayer.totalSeconds));
        this.progressRequestId = requestAnimationFrame(this.updateProgress.bind(this));

        // setInterval(() => {
        //     this._progressPercent = this.audioPlayer.progressPercent;
        // }, 250);
    }
}
