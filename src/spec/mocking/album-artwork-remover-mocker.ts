import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { BaseAlbumArtworkRepository } from '../../app/data/repositories/base-album-artwork-repository';
import { AlbumArtworkRemover } from '../../app/services/indexing/album-artwork-remover';

export class AlbumArtworkRemoverMocker {
    constructor() {
        this.albumArtworkRemover = new AlbumArtworkRemover(
            this.albumArtworkRepositoryMock.object,
            this.fileSystemMock.object,
            this.loggerMock.object);
    }

    public albumArtworkRepositoryMock: IMock<BaseAlbumArtworkRepository> = Mock.ofType<BaseAlbumArtworkRepository>();
    public fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public albumArtworkRemover: AlbumArtworkRemover;
}
