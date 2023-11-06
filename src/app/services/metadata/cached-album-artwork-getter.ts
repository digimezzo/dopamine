import { Injectable } from '@angular/core';
import { AlbumData } from '../../data/entities/album-data';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class CachedAlbumArtworkGetter {
    public constructor(
        private trackRepository: TrackRepositoryBase,
        private fileAccess: FileAccessBase,
    ) {}

    public getCachedAlbumArtworkPath(albumKey: string): string {
        const albumDataForAlbumKey: AlbumData[] = this.trackRepository.getAlbumDataForAlbumKey(albumKey) ?? [];

        if (albumDataForAlbumKey.length > 0 && !StringUtils.isNullOrWhiteSpace(albumDataForAlbumKey[0].artworkId)) {
            return this.fileAccess.coverArtFullPath(albumDataForAlbumKey[0].artworkId!);
        }

        return '';
    }
}
