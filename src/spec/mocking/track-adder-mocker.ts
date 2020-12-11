import { IMock, Mock } from 'typemoq';
import { Logger } from '../../app/core/logger';
import { BaseSettings } from '../../app/core/settings/base-settings';
import { BaseFolderTrackRepository } from '../../app/data/repositories/base-folder-track-repository';
import { BaseRemovedTrackRepository } from '../../app/data/repositories/base-removed-track-repository';
import { BaseTrackRepository } from '../../app/data/repositories/base-track-repository';
import { IndexablePathFetcher } from '../../app/services/indexing/indexable-path-fetcher';
import { TrackAdder } from '../../app/services/indexing/track-adder';
import { TrackFiller } from '../../app/services/indexing/track-filler';
import { BaseSnackBarService } from '../../app/services/snack-bar/base-snack-bar.service';

export class TrackAdderMocker {
    constructor() {
        this.trackAdder = new TrackAdder(
            this.trackRepositoryMock.object,
            this.folderTrackRepositoryMock.object,
            this.removedTrackRepositoryMock.object,
            this.indexablePathFetcherMock.object,
            this.trackFillerMock.object,
            this.settingsMock.object,
            this.loggerMock.object,
            this.snackBarServiceMock.object
        );
    }

    public trackRepositoryMock: IMock<BaseTrackRepository> = Mock.ofType<BaseTrackRepository>();
    public folderTrackRepositoryMock: IMock<BaseFolderTrackRepository> = Mock.ofType<BaseFolderTrackRepository>();
    public removedTrackRepositoryMock: IMock<BaseRemovedTrackRepository> = Mock.ofType<BaseRemovedTrackRepository>();
    public indexablePathFetcherMock: IMock<IndexablePathFetcher> = Mock.ofType<IndexablePathFetcher>();
    public trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
    public settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
    public trackAdder: TrackAdder;
}
