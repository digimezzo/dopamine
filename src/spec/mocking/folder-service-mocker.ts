import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { BaseFolderRepository } from '../../app/data/repositories/base-folder-repository';
import { FolderService } from '../../app/services/folder/folder.service';
import { BaseSnackBarService } from '../../app/services/snack-bar/base-snack-bar.service';

export class FolderServiceMocker {
    constructor() {
        this.folderService = new FolderService(
            this.folderRepositoryMock.object,
            this.loggerMock.object,
            this.snackBarServiceMock.object,
            this.fileSystemMock.object);
    }

    public folderRepositoryMock: IMock<BaseFolderRepository> = Mock.ofType<BaseFolderRepository>();
    public snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    public folderService: FolderService;
}
