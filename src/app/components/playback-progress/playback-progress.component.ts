import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../../core/logger';
import { MathExtensions } from '../../core/math-extensions';
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
    public progressTrack: ElementRef;
    private progressMargin: number = 6;

    constructor(private playbackService: BasePlaybackService, private mathExtensions: MathExtensions, private logger: Logger) {}

    public showProgressThumb: boolean = false;
    public isProgressThumbDown: boolean = false;

    public progressBarPosition: number = 0;
    public progressThumbPosition: number = 0;

    public isProgressDragged: boolean = false;
    public isProgressContainerDown: boolean = false;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                if (!this.isProgressThumbDown && !this.isProgressContainerDown) {
                    this.applyPlaybackProgress(playbackProgress);
                }
            })
        );
    }

    public progressThumbMouseDown(): void {
        this.isProgressThumbDown = true;
    }

    public progressContainerMouseEnter(): void {
        this.showProgressThumb = true;
    }

    public progressContainerMouseLeave(): void {
        if (!this.isProgressThumbDown) {
            this.showProgressThumb = false;
        }
    }

    public progressContainerMouseDown(e: any): void {
        this.isProgressContainerDown = true;
        this.applyMouseProgress(e.clientX);
    }

    @HostListener('document:mouseup', ['$event'])
    public onMouseUp(e: any): void {
        this.isProgressThumbDown = false;
        this.showProgressThumb = false;

        if (this.isProgressDragged || this.isProgressContainerDown) {
            this.isProgressDragged = false;
            this.isProgressContainerDown = false;
            const progressTrackWidth: number = this.progressTrack.nativeElement.offsetWidth;
            this.playbackService.skipByFractionOfTotalSeconds(this.progressBarPosition / progressTrackWidth);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: any): void {
        if (this.isProgressThumbDown) {
            this.isProgressDragged = true;
            this.applyMouseProgress(e.pageX);
        }
    }

    private applyPlaybackProgress(playbackProgress: PlaybackProgress): void {
        const progressTrackWidth: number = this.progressTrack.nativeElement.offsetWidth;

        if (playbackProgress.totalSeconds <= 0) {
            this.progressBarPosition = 0;
            this.progressThumbPosition = 0;

            return;
        }

        this.progressBarPosition = (playbackProgress.progressSeconds / playbackProgress.totalSeconds) * progressTrackWidth;
        this.progressThumbPosition = this.mathExtensions.clamp(
            this.progressBarPosition - this.progressMargin,
            this.progressMargin,
            progressTrackWidth - 2 * this.progressMargin
        );
    }

    private applyMouseProgress(mouseXPosition: number): void {
        const progressTrackWidth: number = this.progressTrack.nativeElement.offsetWidth;

        this.progressBarPosition = this.mathExtensions.clamp(mouseXPosition, 0, progressTrackWidth);
        this.progressThumbPosition = this.mathExtensions.clamp(
            this.progressBarPosition - this.progressMargin,
            this.progressMargin,
            progressTrackWidth - 2 * this.progressMargin
        );
    }
}
