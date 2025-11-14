import { Injectable } from '@angular/core';
import Vibrant from 'node-vibrant/lib/bundle';
import { Logger } from '../../common/logger';
import { MetadataService } from '../metadata/metadata.service';

@Injectable({ providedIn: 'root' })
export class AlbumAccentColorService {
    public constructor(
        private metadataService: MetadataService,
        private logger: Logger,
    ) {}

    public async getAlbumAccentColorAsync(albumKey: string): Promise<string> {
        const albumArtworkPath: string = this.metadataService.getAlbumArtworkPath(albumKey);

        try {
            const palette = await Vibrant.from(`file://${albumArtworkPath}`).getPalette();
            return palette.Vibrant?.getHex() ?? '';
        } catch (e) {
            this.logger.error(e, 'Could not extract accent color from album cover', 'AlbumAccentColorService', 'getAlbumAccentColorAsync');
        }

        return '';
    }
}
