import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Logger } from '../../core/logger';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackProgress } from '../../services/playback/playback-progress';

@Component({
    selector: 'app-playback-progress',
    host: { style: 'display: block' },
    templateUrl: './playback-progress.component.html',
    styleUrls: ['./playback-progress.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackProgressComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    @ViewChild('progressTrack')
    private progressTrack: ElementRef;

    @ViewChild('progressBar')
    private progressBar: ElementRef;

    @ViewChild('progressThumb')
    private progressThumb: ElementRef;

    constructor(public playbackService: BasePlaybackService, public sanitizer: DomSanitizer, private logger: Logger) {}

    public showProgressThumb: boolean = false;

    public progressBarPosition: number = 0;
    public progressThumbPosition: number = 0;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                this.calculateProgress(playbackProgress);
            })
        );
    }

    private calculateProgress(playbackProgress: PlaybackProgress): void {
        const progressTrackWidth: number = this.progressTrack.nativeElement.offsetWidth;

        if (playbackProgress.totalSeconds > 0) {
            this.progressBarPosition = (playbackProgress.progressSeconds / playbackProgress.totalSeconds) * progressTrackWidth;
        } else {
            this.progressBarPosition = 0;
        }

        if (this.progressBarPosition > progressTrackWidth - 12) {
            this.progressThumbPosition = this.progressBarPosition - 12;
        } else if (this.progressBarPosition < 6) {
            this.progressThumbPosition = 0;
        } else {
            this.progressThumbPosition = this.progressBarPosition - 6;
        }
    }

    public progressContainerMouseEnter(): void {
        this.showProgressThumb = true;
    }

    public progressContainerMouseLeave(): void {
        this.showProgressThumb = false;
    }
}
