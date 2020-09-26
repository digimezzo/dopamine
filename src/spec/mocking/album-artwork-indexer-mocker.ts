import { IMock, Mock } from 'typemoq';
import { Logger } from '../../app/core/logger';
import { TrackRepository } from '../../app/data/repositories/track-repository';
import { AlbumArtworkAdder } from '../../app/services/indexing/album-artwork-adder';
import { AlbumArtworkIndexer } from '../../app/services/indexing/album-artwork-indexer';
import { AlbumArtworkRemover } from '../../app/services/indexing/album-artwork-remover';

export class AlbumArtworkIndexerMocker {
    constructor() {
        this.albumArtworkIndexer = new AlbumArtworkIndexer(
            this.trackRepositoryMock.object,
            this.albumArtworkRemoverMock.object,
            this.albumArtworkAdderMock.object,
            this.loggerMock.object
        );
    }

    public trackRepositoryMock: IMock<TrackRepository> = Mock.ofType<TrackRepository>();
    public albumArtworkRemoverMock: IMock<AlbumArtworkRemover> = Mock.ofType<AlbumArtworkRemover>();
    public albumArtworkAdderMock: IMock<AlbumArtworkAdder> = Mock.ofType<AlbumArtworkAdder>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public albumArtworkIndexer: AlbumArtworkIndexer;
}
