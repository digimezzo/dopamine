import { IMock, Mock } from 'typemoq';
import { AlbumArtworkGetter } from '../../app/services/indexing/album-artwork-getter';
import { EmbeddedAlbumArtworkGetter } from '../../app/services/indexing/embedded-album-artwork-getter';
import { ExternalAlbumArtworkGetter } from '../../app/services/indexing/external-album-artwork-getter';
import { OnlineAlbumArtworkGetter } from '../../app/services/indexing/online-album-artwork-getter';
import { SettingsMock } from './settings-mock';

export class AlbumArtworkGetterMocker {
    constructor(private downloadMissingAlbumCovers: boolean) {
        this.albumArtworkGetter = new AlbumArtworkGetter(
            this.embeddedAlbumArtworkGetterMock.object,
            this.externalAlbumArtworkGetterMock.object,
            this.onlineAlbumArtworkGetterMock.object,
            this.settingsMock
        );
    }

    public embeddedAlbumArtworkGetterMock: IMock<EmbeddedAlbumArtworkGetter> = Mock.ofType<EmbeddedAlbumArtworkGetter>();
    public externalAlbumArtworkGetterMock: IMock<ExternalAlbumArtworkGetter> = Mock.ofType<ExternalAlbumArtworkGetter>();
    public onlineAlbumArtworkGetterMock: IMock<OnlineAlbumArtworkGetter> = Mock.ofType<OnlineAlbumArtworkGetter>();
    public settingsMock: SettingsMock = new SettingsMock(false, this.downloadMissingAlbumCovers);
    public albumArtworkGetter: AlbumArtworkGetter;
}
