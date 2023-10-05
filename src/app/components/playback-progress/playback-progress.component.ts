import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { NativeElementProxy } from '../../common/native-element-proxy';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackProgress } from '../../services/playback/playback-progress';

@Component({
    selector: 'app-playback-progress',
    host: { style: 'display: block' },
    templateUrl: './playback-progress.component.html',
    styleUrls: ['./playback-progress.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackProgressComponent implements OnInit, OnDestroy, AfterViewInit {
    private subscription: Subscription = new Subscription();

    @ViewChild('progressTrack')
    public progressTrack: ElementRef;
    private progressMargin: number = 6;

    public constructor(
        private playbackService: BasePlaybackService,
        private mathExtensions: MathExtensions,
        private nativeElementProxy: NativeElementProxy,
        private logger: Logger
    ) {}

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

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.applyPlaybackProgress(this.playbackService.progress);
        }, 0);
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

    public progressContainerMouseDown(e: MouseEvent): void {
        this.isProgressContainerDown = true;

        if (!this.playbackService.isPlaying) {
            return;
        }

        this.applyMouseProgress(e.pageX);
    }

    @HostListener('document:mouseup')
    public onMouseUp(): void {
        this.isProgressThumbDown = false;
        this.showProgressThumb = false;

        if (!this.playbackService.isPlaying) {
            return;
        }

        if (this.isProgressDragged || this.isProgressContainerDown) {
            this.isProgressDragged = false;
            this.isProgressContainerDown = false;
            try {
                const progressTrackWidth: number = this.nativeElementProxy.getElementWidth(this.progressTrack);
                this.playbackService.skipByFractionOfTotalSeconds(this.progressBarPosition / progressTrackWidth);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not skip by fraction of total seconds', 'PlaybackProgressComponent', 'onMouseUp');
            }
        }
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent): void {
        if (!this.playbackService.isPlaying) {
            return;
        }

        if (this.isProgressThumbDown) {
            this.isProgressDragged = true;
            this.applyMouseProgress(e.pageX);
        }
    }

    private applyPlaybackProgress(playbackProgress: PlaybackProgress): void {
        try {
            const progressTrackWidth: number = this.nativeElementProxy.getElementWidth(this.progressTrack);

            if (playbackProgress.totalSeconds <= 0) {
                this.progressBarPosition = 0;
                this.progressThumbPosition = 0;

                return;
            }

            this.progressBarPosition = (playbackProgress.progressSeconds / playbackProgress.totalSeconds) * progressTrackWidth;
            this.progressThumbPosition = this.mathExtensions.clamp(
                this.progressBarPosition - this.progressMargin,
                0,
                progressTrackWidth - 2 * this.progressMargin
            );
        } catch (e: unknown) {
            this.logger.error(e, 'Could not apply playback progress', 'PlaybackProgressComponent', 'applyPlaybackProgress');
        }
    }

    private applyMouseProgress(mouseXPosition: number): void {
        try {
            const progressTrackWidth: number = this.nativeElementProxy.getElementWidth(this.progressTrack);

            this.progressBarPosition = this.mathExtensions.clamp(mouseXPosition, 0, progressTrackWidth);
            this.progressThumbPosition = this.mathExtensions.clamp(
                this.progressBarPosition - this.progressMargin,
                0,
                progressTrackWidth - 2 * this.progressMargin
            );
        } catch (e: unknown) {
            this.logger.error(e, 'Could not apply mouse progress', 'PlaybackProgressComponent', 'applyMouseProgress');
        }
    }
}
