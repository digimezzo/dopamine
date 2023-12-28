import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { SettingsBase } from '../../common/settings/settings.base';
import { TrackAdder } from './track-adder';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FolderTrackRepositoryBase } from '../../data/repositories/folder-track-repository.base';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { MetadataAdder } from './metadata-adder';
import { IndexableTrackFetcher } from './indexable-track-fetcher';
import { MockCreator } from '../../testing/mock-creator';
import { IndexableTrack } from './indexable-track';

describe('TrackAdder', () => {
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let folderTrackRepositoryMock: IMock<FolderTrackRepositoryBase>;
    let indexableTrackFetcherMock: IMock<IndexableTrackFetcher>;
    let metadataAdderMock: IMock<MetadataAdder>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;
    let snackBarServiceMock: IMock<SnackBarServiceBase>;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        folderTrackRepositoryMock = Mock.ofType<FolderTrackRepositoryBase>();
        indexableTrackFetcherMock = Mock.ofType<IndexableTrackFetcher>();
        metadataAdderMock = Mock.ofType<MetadataAdder>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();
        snackBarServiceMock = Mock.ofType<SnackBarServiceBase>();
    });

    function createSut(batchSize: number): TrackAdder {
        const trackAdder: TrackAdder = new TrackAdder(
            trackRepositoryMock.object,
            folderTrackRepositoryMock.object,
            indexableTrackFetcherMock.object,
            metadataAdderMock.object,
            settingsMock.object,
            loggerMock.object,
            snackBarServiceMock.object,
        );
        trackAdder.batchSize = batchSize;

        return trackAdder;
    }

    describe('addTracksThatAreNotInTheDatabase', () => {
        it('should add tracks in batches', async () => {
            // Arrange
            const it1: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 1.mp3', 1, 1);
            const it2: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 2.mp3', 2, 2);
            const it3: IndexableTrack = MockCreator.createIndexableTrack('/home/user/Music/Track 3.mp3', 3, 3);

            settingsMock.setup((x) => x.skipRemovedFilesDuringRefresh).returns(() => false);

            indexableTrackFetcherMock.setup((x) => x.getIndexableTracksAsync(false)).returns(() => Promise.resolve([it1, it2, it3]));

            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([it1, it2], false)).returns(() => Promise.resolve([it1, it2]));
            metadataAdderMock.setup((x) => x.addMetadataToTracksAsync([it3], false)).returns(() => Promise.resolve([it3]));

            const sut: TrackAdder = createSut(2);

            // Act
            await sut.addTracksThatAreNotInTheDatabaseAsync();

            // Assert
            metadataAdderMock.verify((x) => x.addMetadataToTracksAsync([it1, it2], false), Times.once());
            metadataAdderMock.verify((x) => x.addMetadataToTracksAsync([it3], false), Times.once());
        });
    });
});
