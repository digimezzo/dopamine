import { IMock, It, Mock, Times } from 'typemoq';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { TrackBrowserBase } from './track-brower-base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { ContextMenuOpener } from '../../context-menu-opener';
import { MouseSelectionWatcher } from '../../mouse-selection-watcher';
import { Logger } from '../../../../common/logger';
import { CollectionServiceBase } from '../../../../services/collection/collection.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { Track } from '../../../../data/entities/track';
import { TrackModel } from '../../../../services/track/track-model';
import { DateTime } from '../../../../common/date-time';
import { SettingsMock } from '../../../../testing/settings-mock';
import { PlaybackService } from '../../../../services/playback/playback.service';

describe('TrackBrowserBase', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let loggerMock: IMock<Logger>;
    let collectionServiceMock: IMock<CollectionServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let desktopMock: IMock<DesktopBase>;
    let settingsMock: any;

    let track1: Track;
    let track2: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        collectionServiceMock = Mock.ofType<CollectionServiceBase>();
        desktopMock = Mock.ofType<DesktopBase>();
        settingsMock = new SettingsMock();

        translatorServiceMock.setup((x) => x.getAsync('delete-song')).returns(() => Promise.resolve('delete-song'));
        translatorServiceMock.setup((x) => x.getAsync('confirm-delete-song')).returns(() => Promise.resolve('confirm-delete-song'));
        translatorServiceMock.setup((x) => x.getAsync('delete-songs')).returns(() => Promise.resolve('delete-songs'));
        translatorServiceMock.setup((x) => x.getAsync('confirm-delete-songs')).returns(() => Promise.resolve('confirm-delete-songs'));

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

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, settingsMock);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, settingsMock);
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
            desktopMock.object,
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

    describe('onTrackContextMenu', () => {
        it('should open the track context menu', () => {
            // Arrange
            const trackBrowserBase: TrackBrowserBase = create();
            const event: any = {};

            // Act
            trackBrowserBase.onTrackContextMenu(event, trackModel2);

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
                .returns(() => Promise.resolve(false));
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onDeleteAsync();

            // Assert
            collectionServiceMock.verify((x) => x.deleteTracksAsync(It.isAny()), Times.never());
        });

        it('should delete tracks if the user has confirmed', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs'))
                .returns(() => Promise.resolve(true));
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            await trackBrowserBase.onDeleteAsync();

            // Assert
            collectionServiceMock.verify((x) => x.deleteTracksAsync([trackModel1, trackModel2]), Times.once());
        });
    });

    describe('onShowInFolder', () => {
        it('should not show in folder if there are no tracks selected', () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => []);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            trackBrowserBase.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(It.isAny()), Times.never());
        });

        it('should show the first selected track in folder if there are tracks selected', () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const trackBrowserBase: TrackBrowserBase = create();

            // Act
            trackBrowserBase.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(trackModel1.path), Times.once());
        });
    });
});
