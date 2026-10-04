import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../../../common/logger';
import { MathExtensions } from '../../../common/math-extensions';
import { NativeElementProxy } from '../../../common/native-element-proxy';
import { SettingsBase } from '../../../common/settings/settings.base';
import { PlaybackProgress } from '../../../services/playback/playback-progress';
import { PlaybackService } from '../../../services/playback/playback.service';

@Component({
    selector: 'app-playback-progress',
    host: { style: 'display: block' },
    templateUrl: './playback-progress.component.html',
    styleUrls: ['./playback-progress.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlaybackProgressComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
    private subscription: Subscription = new Subscription();

    @ViewChild('progressContainer')
    public progressContainer: ElementRef<HTMLElement>;

    @ViewChild('progressTrack')
    public progressTrack: ElementRef;
    private progressMargin: number = 6;

    @ViewChild('waveSvg')
    public waveSvg: ElementRef<SVGSVGElement>;

    @ViewChild('wavePath')
    public wavePath: ElementRef<SVGPathElement>;

    private readonly waveHeight: number = 12;
    private readonly waveLength: number = 28;
    private readonly waveAmplitude: number = 2.5;
    // Amplitude ramps down to 0 over this distance, so the wave ends flush with the flat track.
    private readonly waveTaperLength: number = this.waveLength * 2;
    // How fast the wave pattern flows, in pixels per second.
    private readonly waveSpeed: number = 15;
    private readonly waveTransitionSpeed: number = 2;

    private wavePhase: number = 0;
    private waveAmplitudeMultiplier: number = 0;
    private targetWaveAmplitudeMultiplier: number = 0;
    private lastWaveFrameTime: number = 0;
    private waveAnimationFrameId: number | undefined;
    private progressTrackResizeObserver: ResizeObserver | undefined;
    private footerBackground: HTMLElement | null = null;
    private coverPane: HTMLElement | null = null;
    private wasWaveEnabled: boolean = true;

    public constructor(
        private playbackService: PlaybackService,
        private mathExtensions: MathExtensions,
        private nativeElementProxy: NativeElementProxy,
        public settings: SettingsBase,
        private ngZone: NgZone,
        private logger: Logger,
    ) {}

    public showProgressThumb: boolean = false;
    public isProgressThumbDown: boolean = false;

    public progressBarPosition: number = 0;
    public progressThumbPosition: number = 0;

    public isProgressDragged: boolean = false;
    public isProgressContainerDown: boolean = false;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.cancelWaveAnimation();
        this.progressTrackResizeObserver?.disconnect();
        this.clearFooterClip();
    }

    public ngDoCheck(): void {
        if (this.wasWaveEnabled === this.settings.showWaveProgress) {
            return;
        }

        this.wasWaveEnabled = this.settings.showWaveProgress;

        if (this.wasWaveEnabled) {
            setTimeout(() => {
                if (this.settings.showWaveProgress) {
                    this.renderWave();

                    if (this.playbackService.canPause) {
                        this.startWaveAnimation();
                    }
                }
            }, 0);
        } else {
            this.cancelWaveAnimation();
            this.clearFooterClip();
            this.waveAmplitudeMultiplier = 0;
            this.targetWaveAmplitudeMultiplier = 0;
        }
    }

    public ngOnInit(): void {
        this.subscription.add(
            this.playbackService.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                if (!this.isProgressThumbDown && !this.isProgressContainerDown) {
                    this.applyPlaybackProgress(playbackProgress);
                }
            }),
        );

        this.subscription.add(this.playbackService.playbackStarted$.subscribe(() => this.startWaveAnimation()));
        this.subscription.add(this.playbackService.playbackResumed$.subscribe(() => this.startWaveAnimation()));
        this.subscription.add(this.playbackService.playbackPaused$.subscribe(() => this.stopWaveAnimation()));
        this.subscription.add(this.playbackService.playbackStopped$.subscribe(() => this.stopWaveAnimation()));
    }

    public ngAfterViewInit(): void {
        this.footerBackground = this.progressContainer?.nativeElement.closest('.window-frame')?.querySelector('.theme-footer-background') ?? null;
        this.coverPane = this.progressContainer?.nativeElement.closest('app-cover-player')?.querySelector('.cover-player__cover-pane') ?? null;

        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.applyPlaybackProgress(this.playbackService.progress);
            this.renderWave();

            // Note: playbackService.isPlaying stays true while paused, so canPause is used to detect actual playback.
            if (this.playbackService.canPause) {
                this.startWaveAnimation();
            }
        }, 0);

        // The track's width can still change after this (e.g. when switching screens), so re-measure whenever it does.
        try {
            this.progressTrackResizeObserver = new ResizeObserver(() => {
                if (!this.isProgressThumbDown && !this.isProgressContainerDown) {
                    this.applyPlaybackProgress(this.playbackService.progress);
                    this.renderWave();
                }
            });

            this.progressTrackResizeObserver.observe(this.progressTrack.nativeElement);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not observe progress track resize', 'PlaybackProgressComponent', 'ngAfterViewInit');
        }
    }

    private startWaveAnimation(): void {
        if (!this.settings.showWaveProgress) {
            return;
        }

        this.targetWaveAmplitudeMultiplier = 1;
        this.runWaveAnimation();
    }

    private stopWaveAnimation(): void {
        this.targetWaveAmplitudeMultiplier = 0;

        if (this.waveAmplitudeMultiplier > 0) {
            this.runWaveAnimation();
            return;
        }

        this.cancelWaveAnimation();
    }

    private runWaveAnimation(): void {
        if (this.waveAnimationFrameId != undefined) {
            return;
        }

        this.lastWaveFrameTime = 0;

        // Runs outside Angular to avoid triggering change detection on every animation frame.
        this.ngZone.runOutsideAngular(() => {
            const frameIntervalMilliseconds: number = 33;

            const renderFrame: FrameRequestCallback = (timestamp: number): void => {
                if (!this.settings.showWaveProgress) {
                    this.waveAnimationFrameId = undefined;
                    return;
                }

                if (timestamp - this.lastWaveFrameTime >= frameIntervalMilliseconds) {
                    const deltaSeconds: number = this.lastWaveFrameTime === 0 ? 0 : (timestamp - this.lastWaveFrameTime) / 1000;
                    this.lastWaveFrameTime = timestamp;
                    const amplitudeChange: number = this.waveTransitionSpeed * deltaSeconds;
                    this.waveAmplitudeMultiplier = this.moveTowards(
                        this.waveAmplitudeMultiplier,
                        this.targetWaveAmplitudeMultiplier,
                        amplitudeChange,
                    );

                    if (this.targetWaveAmplitudeMultiplier > 0) {
                        this.wavePhase = (this.wavePhase + this.waveSpeed * deltaSeconds) % this.waveLength;
                    }

                    this.renderWave();
                }

                if (this.targetWaveAmplitudeMultiplier === 0 && this.waveAmplitudeMultiplier === 0) {
                    this.waveAnimationFrameId = undefined;
                    return;
                }

                this.waveAnimationFrameId = requestAnimationFrame(renderFrame);
            };

            this.waveAnimationFrameId = requestAnimationFrame(renderFrame);
        });
    }

    private cancelWaveAnimation(): void {
        if (this.waveAnimationFrameId != undefined) {
            cancelAnimationFrame(this.waveAnimationFrameId);
            this.waveAnimationFrameId = undefined;
        }
    }

    private moveTowards(currentValue: number, targetValue: number, maximumChange: number): number {
        if (currentValue < targetValue) {
            return Math.min(currentValue + maximumChange, targetValue);
        }

        return Math.max(currentValue - maximumChange, targetValue);
    }

    private renderWave(): void {
        try {
            if (!this.settings.showWaveProgress) {
                return;
            }

            const width: number = this.progressBarPosition;
            const svgElement: SVGSVGElement | undefined = this.waveSvg?.nativeElement;
            const pathElement: SVGPathElement | undefined = this.wavePath?.nativeElement;

            if (svgElement == undefined || pathElement == undefined) {
                return;
            }

            svgElement.setAttribute('width', `${width}`);
            svgElement.setAttribute('height', `${this.waveHeight}`);
            svgElement.setAttribute('viewBox', `0 0 ${width} ${this.waveHeight}`);
            const points: Array<{ x: number; y: number }> = this.createWavePoints(width, this.wavePhase);
            pathElement.setAttribute('d', points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '));
            this.renderFooterClip(svgElement, points);
            this.renderCoverClip(svgElement, points);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not render wave', 'PlaybackProgressComponent', 'renderWave');
        }
    }

    private createWavePoints(width: number, phase: number): Array<{ x: number; y: number }> {
        if (width <= 0) {
            return [];
        }

        const centerY: number = this.waveHeight / 2;
        const step: number = 4;
        const points: Array<{ x: number; y: number }> = [];

        for (let x: number = 0; x < width; x += step) {
            const amplitude: number = this.waveAmplitudeAt(x, width);
            const y: number = centerY - amplitude * Math.sin((2 * Math.PI * (x + phase)) / this.waveLength);
            points.push({ x, y: Number(y.toFixed(2)) });
        }

        points.push({ x: width, y: centerY });

        return points;
    }

    private renderFooterClip(svgElement: SVGSVGElement, points: Array<{ x: number; y: number }>): void {
        if (this.footerBackground == null) {
            return;
        }

        // Extend only the clipped footer so wave crests above the old seam still have a background.
        this.footerBackground.style.height = '84px';
        const backgroundBounds: DOMRect = this.footerBackground.getBoundingClientRect();
        const waveBounds: DOMRect = svgElement.getBoundingClientRect();
        const centerY: number = waveBounds.top - backgroundBounds.top + this.waveHeight / 2;
        const xOffset: number = waveBounds.left - backgroundBounds.left;
        const playedEdge: number = xOffset + this.progressBarPosition;
        const boundary: string[] = points.map((point) => `${xOffset + point.x}px ${waveBounds.top - backgroundBounds.top + point.y}px`);

        if (boundary.length === 0) {
            boundary.push(`0px ${centerY}px`);
        }

        boundary.push(`${playedEdge}px ${centerY}px`, `100% ${centerY}px`, '100% 100%', '0 100%');
        this.footerBackground.style.clipPath = `polygon(${boundary.join(', ')})`;
    }

    private renderCoverClip(svgElement: SVGSVGElement, points: Array<{ x: number; y: number }>): void {
        if (this.coverPane == null) {
            return;
        }

        const coverBounds: DOMRect = this.coverPane.getBoundingClientRect();
        const waveBounds: DOMRect = svgElement.getBoundingClientRect();
        const centerY: number = waveBounds.top - coverBounds.top + this.waveHeight / 2;
        const xOffset: number = waveBounds.left - coverBounds.left;
        const boundary: string[] = points.map((point) => `${xOffset + point.x}px ${waveBounds.top - coverBounds.top + point.y}px`);

        if (boundary.length === 0) {
            boundary.push(`0px ${centerY}px`);
        }

        this.coverPane.style.clipPath = `polygon(0 0, 100% 0, 100% ${centerY}px, ${boundary.reverse().join(', ')})`;
    }

    private clearFooterClip(): void {
        if (this.footerBackground != null) {
            this.footerBackground.style.clipPath = '';
            this.footerBackground.style.height = '';
        }

        if (this.coverPane != null) {
            this.coverPane.style.clipPath = '';
        }
    }

    private waveAmplitudeAt(x: number, width: number): number {
        const distanceFromEnd: number = width - x;

        if (distanceFromEnd >= this.waveTaperLength) {
            return this.waveAmplitudeMultiplier * this.waveAmplitude;
        }

        if (distanceFromEnd <= 0) {
            return 0;
        }

        const t: number = distanceFromEnd / this.waveTaperLength;

        // Smoothstep easing avoids a visible kink where the wave flattens into the track.
        return this.waveAmplitudeMultiplier * this.waveAmplitude * (t * t * (3 - 2 * t));
    }

    public progressThumbMouseDown(): void {
        this.isProgressThumbDown = true;
    }

    public progressThumbTouchStart(e: TouchEvent): void {
        e.preventDefault();
        this.isProgressThumbDown = true;
        this.showProgressThumb = true;
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

    public progressContainerTouchStart(e: TouchEvent): void {
        e.preventDefault();
        this.isProgressContainerDown = true;
        this.showProgressThumb = true;

        if (!this.playbackService.isPlaying) {
            return;
        }

        this.applyMouseProgress(e.touches[0].pageX);
    }

    @HostListener('document:mouseup')
    public async onMouseUp(): Promise<void> {
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
                await this.playbackService.skipByFractionOfTotalSecondsAsync(this.progressBarPosition / progressTrackWidth);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not skip by fraction of total seconds', 'PlaybackProgressComponent', 'onMouseUp');
            }
        }
    }

    @HostListener('document:touchend')
    public async onTouchEnd(): Promise<void> {
        await this.onMouseUp();
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent): void {
        if (!this.playbackService.isPlaying) {
            return;
        }

        if (this.isProgressThumbDown || this.isProgressContainerDown) {
            this.isProgressDragged = true;
            this.applyMouseProgress(e.pageX);
        }
    }

    @HostListener('document:touchmove', ['$event'])
    public onTouchMove(e: TouchEvent): void {
        if (!this.playbackService.isPlaying) {
            return;
        }

        if (this.isProgressThumbDown || this.isProgressContainerDown) {
            e.preventDefault();
            this.isProgressDragged = true;
            this.applyMouseProgress(e.touches[0].pageX);
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
                progressTrackWidth - 2 * this.progressMargin,
            );
        } catch (e: unknown) {
            this.logger.error(e, 'Could not apply playback progress', 'PlaybackProgressComponent', 'applyPlaybackProgress');
        } finally {
            this.renderWave();
        }
    }

    private applyMouseProgress(mouseXPosition: number): void {
        try {
            const progressTrackWidth: number = this.nativeElementProxy.getElementWidth(this.progressTrack);

            this.progressBarPosition = this.mathExtensions.clamp(mouseXPosition, 0, progressTrackWidth);
            this.progressThumbPosition = this.mathExtensions.clamp(
                this.progressBarPosition - this.progressMargin,
                0,
                progressTrackWidth - 2 * this.progressMargin,
            );
        } catch (e: unknown) {
            this.logger.error(e, 'Could not apply mouse progress', 'PlaybackProgressComponent', 'applyMouseProgress');
        } finally {
            this.renderWave();
        }
    }
}
