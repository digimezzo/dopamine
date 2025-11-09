import { Injectable } from '@angular/core';
import { AlbumData } from '../../data/entities/album-data';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ApplicationPaths } from '../../common/application/application-paths';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class CachedAlbumArtworkGetter {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private applicationPaths: ApplicationPaths,
        private settings: SettingsBase,
    ) {}

    public async getCachedAlbumArtworkPathAsync(albumKey: string): Promise<string> {
        const albumDataForAlbumKey: AlbumData[] =
            (await this.trackRepository.getAlbumDataForAlbumKeyAsync(this.settings.albumKeyIndex, albumKey)) ?? [];

        if (albumDataForAlbumKey.length > 0 && !StringUtils.isNullOrWhiteSpace(albumDataForAlbumKey[0].artworkId)) {
            return this.applicationPaths.coverArtFullPath(albumDataForAlbumKey[0].artworkId!);
        }

        return '';
    }
}
