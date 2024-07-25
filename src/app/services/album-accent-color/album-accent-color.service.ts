import { Injectable } from '@angular/core';
import { MetadataServiceBase } from '../metadata/metadata.service.base';
import Vibrant from 'node-vibrant/lib/bundle';
import { Logger } from '../../common/logger';

@Injectable({ providedIn: 'root' })
export class AlbumAccentColorService {
    public constructor(
        private metadataService: MetadataServiceBase,
        private logger: Logger,
    ) {}

    public async getAlbumAccentColorAsync(albumKey: string): Promise<string> {
        const albumArtworkPath: string = this.metadataService.getAlbumArtworkPath(albumKey);

        try {
            const palette = await Vibrant.from(albumArtworkPath).getPalette();
            return palette.Vibrant?.getHex() ?? '';
        } catch (e) {
            this.logger.error(e, 'Could not extract accent color from album cover', 'AlbumAccentColorService', 'getAlbumAccentColorAsync');
        }

        return '';
    }
}
