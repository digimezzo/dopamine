import { ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../core/logger';
import { MathExtensions } from '../../core/math-extensions';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackProgress } from '../../services/playback/playback-progress';
import { PlaybackProgressComponent } from './playback-progress.component';

describe('PlaybackProgressComponent', () => {
    let component: PlaybackProgressComponent;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let mathExtensionsMock: IMock<MathExtensions>;
    let loggerMock: IMock<Logger>;

    const progressTrackNativeElement: any = { offsetWidth: 500 };
    let progressTrackElementRef: ElementRef = new ElementRef(progressTrackNativeElement);

    let playbackServiceProgressChanged: Subject<PlaybackProgress>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        mathExtensionsMock = Mock.ofType<MathExtensions>();
        loggerMock = Mock.ofType<Logger>();
        progressTrackElementRef = new ElementRef(progressTrackNativeElement);
        component = new PlaybackProgressComponent(playbackServiceMock.object, mathExtensionsMock.object, loggerMock.object);

        component.progressTrack = progressTrackElementRef;

        playbackServiceProgressChanged = new Subject();
        const playbackServiceProgressChanged$: Observable<PlaybackProgress> = playbackServiceProgressChanged.asObservable();

        playbackServiceMock.setup((x) => x.progressChanged$).returns(() => playbackServiceProgressChanged$);

        component.ngOnInit();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should initialize showProgressThumb as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.showProgressThumb).toBeFalsy();
        });

        it('should initialize isProgressThumbClicked as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isProgressThumbDown).toBeFalsy();
        });

        it('should initialize progressBarPosition as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.progressBarPosition).toEqual(0);
        });

        it('should initialize progressThumbPosition as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(component.progressThumbPosition).toEqual(0);
        });

        it('should initialize isProgressDragged as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isProgressDragged).toBeFalsy();
        });

        it('should initialize isProgressContainerDown as false', () => {
            // Arrange

            // Act

            // Assert
            expect(component.isProgressContainerDown).toBeFalsy();
        });
    });

    describe('ngOnInit', () => {
        it('should indicate that the progress thumb is down', () => {
            // Arrange
            component.isProgressThumbDown = false;

            // Act
            component.progressThumbMouseDown();

            // Assert
            expect(component.isProgressThumbDown).toBeTruthy();
        });

        it('should not update the progress if progress thumb is down and progress container is down', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.isProgressContainerDown = true;

            // Act
            playbackServiceProgressChanged.next(new PlaybackProgress(30, 300));

            // Assert
            expect(component.progressBarPosition).toEqual(0);
            expect(component.progressThumbPosition).toEqual(0);
            mathExtensionsMock.verify((x) => x.clamp(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not update the progress if progress thumb is down but progress container is not down', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.isProgressContainerDown = false;

            // Act
            playbackServiceProgressChanged.next(new PlaybackProgress(30, 300));

            // Assert
            expect(component.progressBarPosition).toEqual(0);
            expect(component.progressThumbPosition).toEqual(0);
            mathExtensionsMock.verify((x) => x.clamp(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should not update the progress if progress thumb is not down but progress container is down', () => {
            // Arrange
            component.isProgressThumbDown = false;
            component.isProgressContainerDown = true;

            // Act
            playbackServiceProgressChanged.next(new PlaybackProgress(30, 300));

            // Assert
            expect(component.progressBarPosition).toEqual(0);
            expect(component.progressThumbPosition).toEqual(0);
            mathExtensionsMock.verify((x) => x.clamp(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });

        it('should update the progress if progress thumb is not down and progress container is not down', () => {
            // Arrange
            component.isProgressThumbDown = false;
            component.isProgressContainerDown = false;
            mathExtensionsMock.setup((x) => x.clamp(44, 6, 488)).returns(() => 44);

            // Act
            playbackServiceProgressChanged.next(new PlaybackProgress(30, 300));

            // Assert
            expect(component.progressBarPosition).toEqual(50);
            expect(component.progressThumbPosition).toEqual(44);
            mathExtensionsMock.verify((x) => x.clamp(44, 6, 488), Times.exactly(1));
        });

        it('should not update the progress if progress thumb is not down and progress container is not down and total progress seconds is 0', () => {
            // Arrange
            component.isProgressThumbDown = false;
            component.isProgressContainerDown = false;

            // Act
            playbackServiceProgressChanged.next(new PlaybackProgress(30, 0));

            // Assert
            expect(component.progressBarPosition).toEqual(0);
            expect(component.progressThumbPosition).toEqual(0);
            mathExtensionsMock.verify((x) => x.clamp(It.isAny(), It.isAny(), It.isAny()), Times.never());
        });
    });

    describe('progressThumbMouseDown', () => {
        it('should indicate that the progress thumb is down', () => {
            // Arrange
            component.isProgressThumbDown = false;

            // Act
            component.progressThumbMouseDown();

            // Assert
            expect(component.isProgressThumbDown).toBeTruthy();
        });
    });

    describe('progressContainerMouseEnter', () => {
        it('should show the progress thumb', () => {
            // Arrange
            component.showProgressThumb = false;

            // Act
            component.progressContainerMouseEnter();

            // Assert
            expect(component.showProgressThumb).toBeTruthy();
        });
    });

    describe('progressContainerMouseLeave', () => {
        it('should hide the progress thumb if the progress thumb is not down', () => {
            // Arrange
            component.showProgressThumb = true;
            component.isProgressThumbDown = false;

            // Act
            component.progressContainerMouseLeave();

            // Assert
            expect(component.showProgressThumb).toBeFalsy();
        });

        it('should not hide the progress thumb if the progress thumb is down', () => {
            // Arrange
            component.showProgressThumb = true;
            component.isProgressThumbDown = true;

            // Act
            component.progressContainerMouseLeave();

            // Assert
            expect(component.showProgressThumb).toBeTruthy();
        });
    });

    describe('progressContainerMouseDown', () => {
        it('should indicate that the progress container is down', () => {
            // Arrange
            component.isProgressContainerDown = false;
            const mouseEvent: any = { clientX: 40 };
            mathExtensionsMock.setup((x) => x.clamp(40, 0, 500)).returns(() => 40);
            mathExtensionsMock.setup((x) => x.clamp(34, 6, 488)).returns(() => 34);

            // Act
            component.progressContainerMouseDown(mouseEvent);

            // Assert
            expect(component.isProgressContainerDown).toBeTruthy();
        });

        it('should update the progress', () => {
            // Arrange
            const mouseEvent: any = { clientX: 40 };
            mathExtensionsMock.setup((x) => x.clamp(40, 0, 500)).returns(() => 40);
            mathExtensionsMock.setup((x) => x.clamp(34, 6, 488)).returns(() => 34);

            // Act
            component.progressContainerMouseDown(mouseEvent);

            // Assert
            mathExtensionsMock.verify((x) => x.clamp(40, 0, 500), Times.exactly(1));
            expect(component.progressBarPosition).toEqual(40);
            mathExtensionsMock.verify((x) => x.clamp(34, 6, 488), Times.exactly(1));
            expect(component.progressThumbPosition).toEqual(34);
        });
    });

    describe('onMouseMove', () => {
        it('should indicate that progress is not being dragged if progress thumb is not down', () => {
            // Arrange
            component.isProgressDragged = false;
            component.isProgressThumbDown = false;
            const mouseEvent: any = { pageX: 30 };

            // Act
            component.onMouseMove(mouseEvent);

            // Assert
            expect(component.isProgressDragged).toBeFalsy();
        });

        it('should indicate that progress is being dragged if progress thumb is down', () => {
            // Arrange
            component.isProgressDragged = false;
            component.isProgressThumbDown = true;
            const mouseEvent: any = { pageX: 30 };

            // Act
            component.onMouseMove(mouseEvent);

            // Assert
            expect(component.isProgressDragged).toBeTruthy();
        });

        it('should not update the progress if progress thumb is not down', () => {
            // Arrange
            component.progressThumbPosition = 0;
            component.isProgressThumbDown = false;
            const mouseEvent: any = { pageX: 40 };
            mathExtensionsMock.setup((x) => x.clamp(40, 0, 500)).returns(() => 40);
            mathExtensionsMock.setup((x) => x.clamp(34, 6, 488)).returns(() => 34);

            // Act
            component.onMouseMove(mouseEvent);

            // Assert
            mathExtensionsMock.verify((x) => x.clamp(It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(component.progressBarPosition).toEqual(0);
            mathExtensionsMock.verify((x) => x.clamp(It.isAny(), It.isAny(), It.isAny()), Times.never());
            expect(component.progressThumbPosition).toEqual(0);
        });

        it('should update the progress if progress thumb is down', () => {
            // Arrange
            component.progressBarPosition = 0;
            component.isProgressThumbDown = true;
            const mouseEvent: any = { pageX: 40 };
            mathExtensionsMock.setup((x) => x.clamp(40, 0, 500)).returns(() => 40);
            mathExtensionsMock.setup((x) => x.clamp(34, 6, 488)).returns(() => 34);

            // Act
            component.onMouseMove(mouseEvent);

            // Assert
            mathExtensionsMock.verify((x) => x.clamp(40, 0, 500), Times.exactly(1));
            expect(component.progressBarPosition).toEqual(40);
            mathExtensionsMock.verify((x) => x.clamp(34, 6, 488), Times.exactly(1));
            expect(component.progressThumbPosition).toEqual(34);
        });
    });

    describe('onMouseUp', () => {
        it('should indicate that the progress thumb is not down', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.showProgressThumb = true;
            component.isProgressDragged = true;
            component.isProgressContainerDown = true;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            expect(component.isProgressThumbDown).toBeFalsy();
        });

        it('should indicate that the progress thumb is not shown', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.showProgressThumb = true;
            component.isProgressDragged = true;
            component.isProgressContainerDown = true;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            expect(component.showProgressThumb).toBeFalsy();
        });

        it('should indicate that the progress is not being dragged anymore if the progress is being dragged', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.showProgressThumb = true;
            component.isProgressDragged = true;
            component.isProgressContainerDown = false;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            expect(component.isProgressDragged).toBeFalsy();
        });

        it('should indicate that the progress is not being dragged anymore if the progress container is down', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.showProgressThumb = true;
            component.isProgressDragged = true;
            component.isProgressContainerDown = true;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            expect(component.isProgressDragged).toBeFalsy();
        });

        it('should indicate that the progress container is not down anymore anymore if the progress is being dragged', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.showProgressThumb = true;
            component.isProgressDragged = true;
            component.isProgressContainerDown = true;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            expect(component.isProgressContainerDown).toBeFalsy();
        });

        it('should indicate that the progress container is not down anymore if the progress container is down', () => {
            // Arrange
            component.isProgressThumbDown = true;
            component.showProgressThumb = true;
            component.isProgressDragged = false;
            component.isProgressContainerDown = true;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            expect(component.isProgressContainerDown).toBeFalsy();
        });

        it('should not skip playback when progress is not dragged and progress container is not down', () => {
            // Arrange
            component.isProgressDragged = false;
            component.isProgressContainerDown = false;
            const mouseEvent: any = { pageX: 0 };

            // Act
            component.onMouseUp(mouseEvent);

            // Assert
            playbackServiceMock.verify((x) => x.skipByFractionOfTotalSeconds(It.isAny()), Times.never());
        });
    });
});
