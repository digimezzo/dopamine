import { IMock, Mock } from 'typemoq';
import { Logger } from '../../app/core/logger';
import { BaseFolderRepository } from '../../app/data/repositories/base-folder-repository';
import { BaseFolderTrackRepository } from '../../app/data/repositories/base-folder-track-repository';
import { FolderService } from '../../app/services/folder/folder.service';
import { BaseSnackbarService } from '../../app/services/snack-bar/base-snack-bar.service';

export class FolderServiceMock {
    constructor() {
        const folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
        const folderTrackRepositoryMock: IMock<BaseFolderTrackRepository> = Mock.ofType<BaseFolderTrackRepository>();
        const snackBarServiceMock: IMock<BaseSnackbarService> = Mock.ofType<BaseSnackbarService>();
        const loggerMock: IMock<Logger> = Mock.ofType<Logger>();
        this.folderService = new FolderService(
            folderRepositoryMock.object,
            folderTrackRepositoryMock.object,
            loggerMock.object,
            snackBarServiceMock.object);
    }

    public folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
    public folderTrackRepositoryMock: IMock<BaseFolderTrackRepository> = Mock.ofType<BaseFolderTrackRepository>();
    public snackBarServiceMock: IMock<BaseSnackbarService> = Mock.ofType<BaseSnackbarService>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public folderService: FolderService;
}
