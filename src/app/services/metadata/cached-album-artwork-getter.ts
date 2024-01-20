import { Injectable } from '@angular/core';
import { AlbumData } from '../../data/entities/album-data';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ApplicationPaths } from '../../common/application/application-paths';

@Injectable()
export class CachedAlbumArtworkGetter {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private applicationPaths: ApplicationPaths,
    ) {}

    public getCachedAlbumArtworkPath(albumKey: string): string {
        const albumDataForAlbumKey: AlbumData[] = this.trackRepository.getAlbumDataForAlbumKey(albumKey) ?? [];

        if (albumDataForAlbumKey.length > 0 && !StringUtils.isNullOrWhiteSpace(albumDataForAlbumKey[0].artworkId)) {
            return this.applicationPaths.coverArtFullPath(albumDataForAlbumKey[0].artworkId!);
        }

        return '';
    }
}
