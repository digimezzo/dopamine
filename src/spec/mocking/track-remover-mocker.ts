import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { FolderTrackRepository } from '../../app/data/repositories/folder-track-repository';
import { TrackRepository } from '../../app/data/repositories/track-repository';
import { TrackRemover } from '../../app/services/indexing/track-remover';
import { BaseSnackBarService } from '../../app/services/snack-bar/base-snack-bar.service';

export class TrackRemoverMocker {
    constructor() {
        this.trackRemover = new TrackRemover(
            this.trackRepositoryMock.object,
            this.folderTrackRepositoryMock.object,
            this.snackBarServiceMock.object,
            this.fileSystemMock.object,
            this.loggerMock.object
        );
    }

    public trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
    public folderTrackRepositoryMock: IMock<FolderTrackRepository> = Mock.ofType<FolderTrackRepository>();
    public snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
    public fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public trackRemover: TrackRemover;
}
