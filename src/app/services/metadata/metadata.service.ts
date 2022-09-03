import { Injectable } from '@angular/core';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { FileMetadata } from '../../common/metadata/file-metadata';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter';
import { TrackModel } from '../track/track-model';
import { BaseMetadataService } from './base-metadata.service';

@Injectable()
export class MetadataService implements BaseMetadataService {
    constructor(
        private fileMetadataFactory: FileMetadataFactory,
        private trackRepository: BaseTrackRepository,
        private albumArtworkGetter: AlbumArtworkGetter,
        private imageProcessor: ImageProcessor,
        private logger: Logger
    ) {}

    public async createImageUrlAsync(track: TrackModel): Promise<string> {
        if (track == undefined) {
            return '';
        }

        try {
            const fileMetaData: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);

            if (fileMetaData == undefined) {
                return '';
            }

            const coverArt: Buffer = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetaData, false);

            if (coverArt == undefined) {
                return '';
            }

            return this.imageProcessor.convertBufferToImageUrl(coverArt);
        } catch (error) {
            this.logger.error(
                `Could not create image URL for track with path=${track.path}. Error: ${error.message}`,
                'MetadataService',
                'createImageUrlAsync'
            );
        }

        return '';
    }

    public saveTrackRating(track: TrackModel): void {
        try {
            this.trackRepository.updateRating(track.id, track.rating);
        } catch (error) {
            this.logger.error(`Could not save rating. Error: ${error.message}`, 'MetadataService', 'saveTrackRating');
            throw new Error(error.message);
        }
    }
}
