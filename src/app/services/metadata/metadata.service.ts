import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { Guards } from '../../common/guards';
import { ImageProcessor } from '../../common/image-processor';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { BaseFileMetadataFactory } from '../../common/metadata/base-file-metadata-factory';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter';
import { TrackModel } from '../track/track-model';
import { BaseMetadataService } from './base-metadata.service';
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter';

@Injectable()
export class MetadataService implements BaseMetadataService {
    private ratingSaved: Subject<TrackModel> = new Subject();
    private loveSaved: Subject<TrackModel> = new Subject();

    public constructor(
        private fileMetadataFactory: BaseFileMetadataFactory,
        private trackRepository: BaseTrackRepository,
        private albumArtworkGetter: AlbumArtworkGetter,
        private cachedAlbumArtworkGetter: CachedAlbumArtworkGetter,
        private imageProcessor: ImageProcessor,
        private fileAccess: BaseFileAccess,
        private settings: BaseSettings,
        private logger: Logger
    ) {}

    public ratingSaved$: Observable<TrackModel> = this.ratingSaved.asObservable();
    public loveSaved$: Observable<TrackModel> = this.loveSaved.asObservable();

    public async createImageUrlAsync(track: TrackModel | undefined): Promise<string> {
        if (!Guards.isDefined(track)) {
            return Constants.emptyImage;
        }

        try {
            const fileMetaData: IFileMetadata = await this.fileMetadataFactory.createAsync(track!.path);

            if (Guards.isDefined(fileMetaData)) {
                const coverArt: Buffer | undefined = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetaData, false);

                if (Guards.isDefined(coverArt)) {
                    return this.imageProcessor.convertBufferToImageUrl(coverArt!);
                }
            }

            const cachedAlbumArtworkPath: string = this.cachedAlbumArtworkGetter.getCachedAlbumArtworkPath(track!.albumKey);

            if (!Strings.isNullOrWhiteSpace(cachedAlbumArtworkPath) && this.fileAccess.pathExists(cachedAlbumArtworkPath)) {
                return 'file:///' + cachedAlbumArtworkPath;
            }

            return Constants.emptyImage;
        } catch (error) {
            this.logger.error(
                `Could not create image URL for track with path=${track!.path}. Error: ${error.message}`,
                'MetadataService',
                'createImageUrlAsync'
            );
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
        } catch (error) {
            this.logger.error(`Could not save rating. Error: ${error.message}`, 'MetadataService', 'saveTrackRating');
            throw new Error(error.message);
        }
    }

    public async saveTrackLoveAsync(track: TrackModel): Promise<void> {
        try {
            this.trackRepository.updateLove(track.id, track.love);
            this.loveSaved.next(track);
        } catch (error) {
            this.logger.error(`Could not save love. Error: ${error.message}`, 'MetadataService', 'saveTrackRatingAsync');
            throw new Error(error.message);
        }
    }
}
