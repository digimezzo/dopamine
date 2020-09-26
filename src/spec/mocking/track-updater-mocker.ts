import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { TrackRepository } from '../../app/data/repositories/track-repository';
import { TrackFiller } from '../../app/services/indexing/track-filler';
import { TrackUpdater } from '../../app/services/indexing/track-updater';

export class TrackUpdaterMocker {
    constructor() {
        this.trackUpdater = new TrackUpdater(
            this.trackRepositoryMock.object,
            this.trackFillerMock.object,
            this.fileSystemMock.object,
            this.loggerMock.object
        );
    }

    public trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
    public trackFillerMock: IMock<TrackFiller> = Mock.ofType<TrackFiller>();
    public fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public trackUpdater: TrackUpdater;
}
