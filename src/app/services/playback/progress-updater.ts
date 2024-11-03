import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlaybackProgress } from './playback-progress';
import { AudioPlayerBase } from './audio-player/audio-player.base';

@Injectable()
export class ProgressUpdater {
    private interval: number = 0;
    private shouldReportProgress: boolean = false;
    private progressChanged: Subject<PlaybackProgress> = new Subject();

    public constructor(private audioPlayer: AudioPlayerBase) {}

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();

    public startUpdatingProgress(): void {
        this.reportProgress();
        this.shouldReportProgress = true;

        if (this.interval === 0) {
            this.interval = window.setInterval(() => {
                this.reportProgress();
            }, 500);
        }
    }

    public stopUpdatingProgress(): void {
        this.pauseUpdatingProgress();
        this.progressChanged.next(new PlaybackProgress(0, 0));
    }

    public pauseUpdatingProgress(): void {
        this.shouldReportProgress = false;
    }

    public getCurrentProgress(): PlaybackProgress {
        return new PlaybackProgress(this.audioPlayer.progressSeconds, this.audioPlayer.totalSeconds);
    }

    private reportProgress(): void {
        if (this.shouldReportProgress) {
            this.progressChanged.next(this.getCurrentProgress());
        }
    }
}
