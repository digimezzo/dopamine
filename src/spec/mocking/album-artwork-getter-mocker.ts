import { IMock, Mock } from 'typemoq';
import { AlbumArtworkGetter } from '../../app/services/indexing/album-artwork-getter';
import { EmbeddedAlbumArtworkGetter } from '../../app/services/indexing/embedded-album-artwork-getter';
import { ExternalAlbumArtworkGetter } from '../../app/services/indexing/external-album-artwork-getter';

export class AlbumArtworkGetterMocker {
    constructor() {
        this.albumArtworkGetter = new AlbumArtworkGetter(
            this.embeddedAlbumArtworkGetterMock.object,
            this.externalAlbumArtworkGetterMock.object
        );
    }

    public embeddedAlbumArtworkGetterMock: IMock<EmbeddedAlbumArtworkGetter> = Mock.ofType<EmbeddedAlbumArtworkGetter>();
    public externalAlbumArtworkGetterMock: IMock<ExternalAlbumArtworkGetter> = Mock.ofType<ExternalAlbumArtworkGetter>();
    public albumArtworkGetter: AlbumArtworkGetter;
}
