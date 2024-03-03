import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { StringUtils } from '../../common/utils/string-utils';
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter';
import { TrackModel } from '../track/track-model';
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter';
import { MetadataServiceBase } from './metadata.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class MetadataService implements MetadataServiceBase {
    private ratingSaved: Subject<TrackModel> = new Subject();
    private loveSaved: Subject<TrackModel> = new Subject();

    public constructor(
        private fileMetadataFactory: FileMetadataFactoryBase,
        private trackRepository: TrackRepositoryBase,
        private albumArtworkGetter: AlbumArtworkGetter,
        private cachedAlbumArtworkGetter: CachedAlbumArtworkGetter,
        private imageProcessor: ImageProcessor,
        private fileAccess: FileAccessBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public ratingSaved$: Observable<TrackModel> = this.ratingSaved.asObservable();
    public loveSaved$: Observable<TrackModel> = this.loveSaved.asObservable();

    public async createImageUrlAsync(track: TrackModel | undefined, maximumSize: number): Promise<string> {
        if (track == undefined) {
            return Constants.emptyImage;
        }

        try {
            const fileMetaData: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);

            if (fileMetaData != undefined) {
                let coverArt: Buffer | undefined = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetaData, false);

                if (coverArt != undefined && coverArt.length > 0) {
                    if (maximumSize > 0) {
                        coverArt = await this.imageProcessor.toResizedJpegBufferAsync(coverArt, maximumSize, maximumSize, 80);
                    } else {
                        coverArt = await this.imageProcessor.toJpegBufferAsync(coverArt, 80);
                    }

                    return this.imageProcessor.convertBufferToImageUrl(coverArt);
                }
            }

            const cachedAlbumArtworkPath: string = this.cachedAlbumArtworkGetter.getCachedAlbumArtworkPath(track.albumKey);

            if (!StringUtils.isNullOrWhiteSpace(cachedAlbumArtworkPath) && this.fileAccess.pathExists(cachedAlbumArtworkPath)) {
                return 'file:///' + cachedAlbumArtworkPath;
            }

            return Constants.emptyImage;
        } catch (e: unknown) {
            this.logger.error(e, `Could not create image URL for track with path=${track.path}`, 'MetadataService', 'createImageUrlAsync');
        }

        return Constants.emptyImage;
    }

    public async saveTrackRatingAsync(track: TrackModel): Promise<void> {
        try {
            this.trackRepository.updateRating(track.id, track.rating);

            if (this.settings.saveRatingToAudioFiles && this.fileAccess.getFileExtension(track.path).toLowerCase() === FileFormats.mp3) {
                const fileMetaData: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);
                fileMetaData.rating = track.rating;
                fileMetaData.save();
                this.logger.info(`Saved rating to file '${track.path}'`, 'MetadataService', 'saveTrackRating');
            }

            this.ratingSaved.next(track);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not save rating', 'MetadataService', 'saveTrackRating');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    public saveTrackLove(track: TrackModel): void {
        try {
            this.trackRepository.updateLove(track.id, track.love);
            this.loveSaved.next(track);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not save love', 'MetadataService', 'saveTrackRatingAsync');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }
}
