import { Subscription } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { DateTime } from '../../common/date-time';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseCollectionService } from './base-collection.service';
import { CollectionService } from './collection.service';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

describe('CollectionService', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let desktopMock: IMock<BaseDesktop>;
    let loggerMock: IMock<Logger>;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let service: BaseCollectionService;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        desktopMock = Mock.ofType<BaseDesktop>();
        loggerMock = Mock.ofType<Logger>();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        track1 = new Track('path1');
        track1.trackId = 1;
        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        track2 = new Track('path2');
        track2.trackId = 2;
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
        track3 = new Track('path3');
        track3.trackId = 3;
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object);

        service = new CollectionService(playbackServiceMock.object, trackRepositoryMock.object, desktopMock.object, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should define collectionChanged$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.collectionChanged$).toBeDefined();
        });
    });

    describe('deleteTracksAsync', () => {
        it('should delete tracks from the database', async () => {
            // Arrange

            // Act
            await service.deleteTracksAsync([trackModel1, trackModel2, trackModel3]);

            // Assert
            trackRepositoryMock.verify((x) => x.deleteTracks([1, 2, 3]), Times.once());
        });

        it('should stop playback for all given tracks', async () => {
            // Arrange

            // Act
            await service.deleteTracksAsync([trackModel1, trackModel2, trackModel3]);

            // Assert
            playbackServiceMock.verify((x) => x.stopIfPlaying(trackModel1), Times.once());
            playbackServiceMock.verify((x) => x.stopIfPlaying(trackModel2), Times.once());
            playbackServiceMock.verify((x) => x.stopIfPlaying(trackModel3), Times.once());
        });

        it('should move the files of the given track to trash', async () => {
            // Arrange

            // Act
            await service.deleteTracksAsync([trackModel1, trackModel2, trackModel3]);

            // Assert
            desktopMock.verify((x) => x.moveFileToTrashAsync('path1'), Times.once());
            desktopMock.verify((x) => x.moveFileToTrashAsync('path2'), Times.once());
            desktopMock.verify((x) => x.moveFileToTrashAsync('path3'), Times.once());
        });

        it('should notify that the collection has changed', async () => {
            // Arrange
            let collectionHasChanged: boolean = false;
            const subscription: Subscription = new Subscription();

            subscription.add(
                service.collectionChanged$.subscribe(() => {
                    collectionHasChanged = true;
                })
            );

            // Act
            await service.deleteTracksAsync([trackModel1, trackModel2, trackModel3]);

            // Assert
            expect(collectionHasChanged).toBeTruthy();
        });

        it('should return true if all files could be moved to trash', async () => {
            // Arrange

            // Act
            const returnValue: boolean = await service.deleteTracksAsync([trackModel1, trackModel2, trackModel3]);

            // Assert
            expect(returnValue).toBeTruthy();
        });

        it('should return false if not all files could be moved to trash', async () => {
            // Arrange
            desktopMock.setup((x) => x.moveFileToTrashAsync(It.isAny())).throws(new Error('An error occurred'));

            // Act
            const returnValue: boolean = await service.deleteTracksAsync([trackModel1, trackModel2, trackModel3]);

            // Assert
            expect(returnValue).toBeFalsy();
        });
    });
});
