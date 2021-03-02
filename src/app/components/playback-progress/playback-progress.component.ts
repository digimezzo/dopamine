import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
    public isProgressThumbClicked: boolean = false;

    public progressBarPosition: number = 0;
    public progressThumbPosition: number = 0;

    public isProgressDragged: boolean = false;
    public isProgressContainerClicked: boolean = false;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                if (!this.isProgressThumbClicked && !this.isProgressContainerClicked) {
                    this.calculateProgress(playbackProgress);
                }
            })
        );
    }

    public progressContainerMouseEnter(): void {
        this.showProgressThumb = true;
    }

    public progressContainerMouseLeave(): void {
        if (!this.isProgressThumbClicked) {
            this.showProgressThumb = false;
        }
    }

    public progressContainerMouseDown(e: any): void {
        this.applyProgress(e.clientX);
        this.isProgressContainerClicked = true;
    }

    public progressThumbMouseDown(): void {
        this.isProgressThumbClicked = true;
    }

    @HostListener('document:mouseup', ['$event'])
    public onMouseUp(e: any): void {
        this.isProgressThumbClicked = false;
        this.showProgressThumb = false;

        if (this.isProgressDragged || this.isProgressContainerClicked) {
            this.isProgressDragged = false;
            this.isProgressContainerClicked = false;
            const progressTrackWidth: number = this.progressTrack.nativeElement.offsetWidth;
            this.playbackService.skipByFractionOfTotalSeconds(this.progressBarPosition / progressTrackWidth);
        }
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: any): void {
        if (this.isProgressThumbClicked) {
            this.applyProgress(e.pageX);
            this.isProgressDragged = true;
        }
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

    private applyProgress(mouseXPosition: number): void {
        const progressTrackWidth: number = this.progressTrack.nativeElement.offsetWidth;

        if (this.progressBarPosition > progressTrackWidth) {
            this.progressBarPosition = progressTrackWidth;
        } else if (this.progressBarPosition < 0) {
            this.progressBarPosition = 0;
        } else {
            this.progressBarPosition = mouseXPosition;
        }

        if (this.progressBarPosition > progressTrackWidth - 12) {
            this.progressThumbPosition = this.progressBarPosition - 12;
        } else if (this.progressBarPosition < 6) {
            this.progressThumbPosition = 0;
        } else {
            this.progressThumbPosition = this.progressBarPosition - 6;
        }
    }
}
