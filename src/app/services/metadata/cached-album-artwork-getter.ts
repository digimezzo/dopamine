import { Injectable } from '@angular/core';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Strings } from '../../common/strings';

@Injectable()
export class CachedAlbumArtworkGetter {
    public constructor(private trackRepository: BaseTrackRepository, private fileAccess: BaseFileAccess) {}

    public getCachedAlbumArtworkPath(albumKey: string): string {
        const albumDataForAlbumKey: AlbumData[] = this.trackRepository.getAlbumDataForAlbumKey(albumKey) ?? [];

        if (albumDataForAlbumKey.length > 0 && !Strings.isNullOrWhiteSpace(albumDataForAlbumKey[0].artworkId)) {
            return this.fileAccess.coverArtFullPath(albumDataForAlbumKey[0].artworkId!);
        }

        return '';
    }
}
