import { IMock, It, Mock, Times } from 'typemoq';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { Track } from '../../../common/data/entities/track';
import { DateTime } from '../../../common/date-time';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { TrackModel } from '../../../services/track/track-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { TrackBrowserBase } from './track-brower-base';

describe('TrackBrowserBase', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let loggerMock: IMock<Logger>;
    let collectionServiceMock: IMock<BaseCollectionService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let desktopMock: IMock<BaseDesktop>;

    let track1: Track;
    let track2: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        loggerMock = Mock.ofType<Logger>();
        collectionServiceMock = Mock.ofType<BaseCollectionService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        desktopMock = Mock.ofType<BaseDesktop>();

        translatorServiceMock.setup((x) => x.getAsync('delete-song')).returns(async () => 'delete-song');
        translatorServiceMock.setup((x) => x.getAsync('confirm-delete-song')).returns(async () => 'confirm-delete-song');
        translatorServiceMock.setup((x) => x.getAsync('delete-songs')).returns(async () => 'delete-songs');
        translatorServiceMock.setup((x) => x.getAsync('confirm-delete-songs')).returns(async () => 'confirm-delete-songs');

        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;
        track1.rating = 1;
        track1.love = 0;

        track2 = new Track('Path 2');
        track2.trackTitle = 'Title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;
        track2.rating = 2;
        track2.love = 0;

        const dateTimeMock: IMock<DateTime> = Mock.ofType<DateTime>();

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
    });

    function create(): TrackBrowserBase {
        return new TrackBrowserBase(
            playbackServiceMock.object,
            dialogServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            loggerMock.object,
            collectionServiceMock.object,
            translatorServiceMock.object,
            desktopMock.object
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.playbackService).toBeDefined();
        });

        it('should define dialogService', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.dialogService).toBeDefined();
        });

        it('should define addToPlaylistMenu', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.addToPlaylistMenu).toBeDefined();
        });

        it('should define contextMenuOpener', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.contextMenuOpener).toBeDefined();
        });

        it('should define mouseSelectionWatcher', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.mouseSelectionWatcher).toBeDefined();
        });

        it('should define logger', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.logger).toBeDefined();
        });

        it('should declare trackContextMenu', () => {
            // Arrange

            // Act
            const trackBrowserBase: TrackBrowserBase = create();

            // Assert
            expect(trackBrowserBase.trackContextMenu).toBeUndefined();
        });
    });

    describe('onAddToQueueAsync', () => {
        it('should add the selected tracks to the queue', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onAddToQueueAsync();

            // Assert
            playbackServiceMock.verify((x) => x.addTracksToQueueAsync([trackModel1, trackModel2]), Times.once());
        });
    });

    describe('onTrackContextMenuAsync', () => {
        it('should open the track context menu', async () => {
            // Arrange
            const trackBrowserBase: TrackBrowserBase = create();
            const event: any = {};

            // Act
            trackBrowserBase.onTrackContextMenuAsync(event, trackModel2);

            // Assert
            contextMenuOpenerMock.verify((x) => x.open(trackBrowserBase.trackContextMenu, event, trackModel2), Times.once());
        });
    });

    describe('onDeleteAsync', () => {
        it('should show confirmation dialog with singular text when 1 track is provided', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1]);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onDeleteAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showConfirmationDialogAsync('delete-song', 'confirm-delete-song'), Times.once());
        });

        it('should show confirmation dialog with plural text when more than 1 track is provided', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onDeleteAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs'), Times.once());
        });

        it('should not delete tracks if the user has not confirmed', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs'))
                .returns(async () => false);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onDeleteAsync();

            // Assert
            collectionServiceMock.verify((x) => x.deleteTracksAsync(It.isAny()), Times.never());
        });

        it('should delete tracks if the user has confirmed', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            dialogServiceMock.setup((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs')).returns(async () => true);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onDeleteAsync();

            // Assert
            collectionServiceMock.verify((x) => x.deleteTracksAsync([trackModel1, trackModel2]), Times.once());
        });
    });

    describe('onShowInFolder', () => {
        it('should not show in folder if there are no tracks selected', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => []);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(It.isAny()), Times.never());
        });

        it('should show the first selected track in folder if there are tracks selected', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(trackModel1.path), Times.once());
        });
    });
});
