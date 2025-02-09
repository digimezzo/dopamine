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
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { ImageComparisonStatus } from './image-comparison-status';
import { ImageRenderData } from './image-render-data';

@Injectable({ providedIn: 'root' })
export class MetadataService {
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

    public async createAlbumImageUrlAsync(track: TrackModel | undefined, maximumSize: number): Promise<string> {
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
            this.logger.error(
                e,
                `Could not create image URL for track with path=${track.path}`,
                'MetadataService',
                'createAlbumImageUrlAsync',
            );
        }

        return Constants.emptyImage;
    }

    public async createTrackImageUrlAsync(track: TrackModel | undefined): Promise<string> {
        if (track == undefined) {
            return Constants.emptyImage;
        }

        try {
            const fileMetaData: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);

            if (fileMetaData != undefined) {
                let coverArt: Buffer | undefined = await this.albumArtworkGetter.getEmbeddedAlbumArtworkOnlyAsync(fileMetaData);

                if (coverArt != undefined && coverArt.length > 0) {
                    coverArt = await this.imageProcessor.toJpegBufferAsync(coverArt, 80);
                    return this.imageProcessor.convertBufferToImageUrl(coverArt);
                }
            }

            return Constants.emptyImage;
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not create image URL for track with path=${track.path}`,
                'MetadataService',
                'createTrackImageUrlAsync',
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

    public getAlbumArtworkPath(albumKey: string): string {
        return this.cachedAlbumArtworkGetter.getCachedAlbumArtworkPath(albumKey);
    }

    public compareImages(fileMetadatas: IFileMetadata[]): ImageComparisonStatus {
        const imageSizes: number[] = [];

        for (const fileMetadata of fileMetadatas) {
            const currentImage = fileMetadata.picture;

            if (!currentImage) {
                imageSizes.push(-1);
            } else {
                imageSizes.push(currentImage.length);
            }
        }

        if (imageSizes.every((size) => size === -1 || size === 0)) {
            return ImageComparisonStatus.None;
        }

        if (imageSizes.every((size) => size === imageSizes[0])) {
            return ImageComparisonStatus.Identical;
        }

        return ImageComparisonStatus.Different;
    }
    s;

    public async getImageRenderDataFromFileAsync(imageFilePath: string): Promise<ImageRenderData> {
        try {
            const imageBuffer: Buffer = await this.imageProcessor.convertLocalImageToBufferAsync(imageFilePath);
            const imageUrl: string = this.imageProcessor.convertBufferToImageUrl(imageBuffer);
            return new ImageRenderData(imageUrl, imageBuffer);
        } catch (e: unknown) {
            this.logger.error(e, `Could not read image file '${imageFilePath}'`, 'MetadataService', 'getImageDataRenderAsync');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    public async getImageRenderDataAsync(imageFile: string | Buffer): Promise<ImageRenderData> {
        try {
            let imageBuffer: Buffer;

            if (typeof imageFile === 'string') {
                imageBuffer = await this.imageProcessor.convertLocalImageToBufferAsync(imageFile);
            } else {
                imageBuffer = imageFile;
            }

            const imageUrl: string = this.imageProcessor.convertBufferToImageUrl(imageBuffer);
            return new ImageRenderData(imageUrl, imageBuffer);
        } catch (e: unknown) {
            if (typeof imageFile === 'string') {
                this.logger.error(
                    e,
                    `Could not get image render data for file '${imageFile}'`,
                    'MetadataService',
                    'getImageRenderDataAsync',
                );
            } else {
                this.logger.error(e, 'Could not get image render data for buffer', 'MetadataService', 'getImageRenderDataAsync');
            }

            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }
}
