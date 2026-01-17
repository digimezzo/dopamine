import { Injectable } from '@angular/core';
import { AlbumKeyGenerator } from '../../data/album-key-generator';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { MimeTypes } from '../../common/metadata/mime-types';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackFieldCreator } from './track-field-creator';
import { FileAccessBase } from '../../common/io/file-access.base';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';
import { MetadataPatcher } from '../../common/metadata/metadata-patcher';

@Injectable()
export class TrackFiller {
    public constructor(
        private fileMetadataFactory: FileMetadataFactoryBase,
        private trackFieldCreator: TrackFieldCreator,
        private metadataPatcher: MetadataPatcher,
        private albumKeyGenerator: AlbumKeyGenerator,
        private fileAccess: FileAccessBase,
        private mimeTypes: MimeTypes,
        private dateTime: DateTime,
        private logger: Logger,
    ) {}

    public async addFileMetadataToTrackAsync(track: Track, fillOnlyEssentialMetadata: boolean): Promise<Track> {
        try {
            const fileMetadata: IFileMetadata = await this.fileMetadataFactory.createAsync(track.path);
            return this.addGivenFileMetadataToTrackAsync(track, fileMetadata, fillOnlyEssentialMetadata);
        } catch (e: unknown) {
            this.logger.error(
                e,
                'Error while retrieving tag information for file ${track.path}',
                'TrackFiller',
                'addGivenFileMetadataToTrackAsync',
            );
        }

        return track;
    }

    public async addGivenFileMetadataToTrackAsync(
        track: Track,
        fileMetadata: IFileMetadata,
        fillOnlyEssentialMetadata: boolean,
    ): Promise<Track> {
        try {
            track.artists = this.trackFieldCreator.createMultiTextField(
                this.metadataPatcher.joinUnsplittableMetadata(fileMetadata.artists),
            );
            track.rating = this.trackFieldCreator.createNumberField(fileMetadata.rating);
            track.fileName = this.fileAccess.getFileName(track.path);
            track.duration = this.trackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds);
            track.trackTitle = this.trackFieldCreator.createTextField(fileMetadata.title);
            track.trackNumber = this.trackFieldCreator.createNumberField(fileMetadata.trackNumber);
            track.fileSize = this.fileAccess.getFileSizeInBytes(track.path);
            track.albumKey = this.albumKeyGenerator.generateAlbumKey(
                fileMetadata.album,
                this.metadataPatcher.joinUnsplittableMetadata(fileMetadata.albumArtists),
            );
            track.albumKey2 = this.albumKeyGenerator.generateAlbumKey2(fileMetadata.album);
            track.albumKey3 = this.albumKeyGenerator.generateAlbumKey3(this.fileAccess.getDirectoryPath(track.path));

            if (!fillOnlyEssentialMetadata) {
                const dateNowTicks: number = this.dateTime.convertDateToTicks(new Date());

                track.genres = this.trackFieldCreator.createMultiTextField(
                    this.metadataPatcher.joinUnsplittableMetadata(fileMetadata.genres),
                );
                track.albumTitle = this.trackFieldCreator.createTextField(fileMetadata.album);
                track.albumArtists = this.trackFieldCreator.createMultiTextField(
                    this.metadataPatcher.joinUnsplittableMetadata(fileMetadata.albumArtists),
                );
                track.mimeType = this.getMimeType(track.path);
                track.bitRate = this.trackFieldCreator.createNumberField(fileMetadata.bitRate);
                track.sampleRate = this.trackFieldCreator.createNumberField(fileMetadata.sampleRate);
                track.trackCount = this.trackFieldCreator.createNumberField(fileMetadata.trackCount);
                track.discNumber = this.trackFieldCreator.createNumberField(fileMetadata.discNumber);
                track.discCount = this.trackFieldCreator.createNumberField(fileMetadata.discCount);
                track.year = this.trackFieldCreator.createNumberField(fileMetadata.year);
                track.hasLyrics = this.getHasLyrics(fileMetadata.lyrics);
                track.dateAdded = dateNowTicks;
                track.dateFileCreated = this.fileAccess.getDateCreatedInTicks(track.path);
                track.dateLastSynced = dateNowTicks;
                track.dateFileModified = this.fileAccess.getDateModifiedInTicks(track.path);
                track.composers = this.trackFieldCreator.createMultiTextField(
                    this.metadataPatcher.joinUnsplittableMetadata(fileMetadata.composers),
                );
                track.conductor = this.trackFieldCreator.createTextField(fileMetadata.conductor);
                track.beatsPerMinute = this.trackFieldCreator.createNumberField(fileMetadata.beatsPerMinute);
            }

            track.needsIndexing = 0;
            track.needsAlbumArtworkIndexing = 1;
            track.indexingSuccess = 1;
            track.indexingFailureReason = '';
        } catch (e: unknown) {
            track.indexingSuccess = 0;

            track.indexingFailureReason = e instanceof Error ? e.message : 'Unknown error';

            this.logger.error(
                e,
                'Error while retrieving tag information for file ${track.path}',
                'TrackFiller',
                'addFileMetadataToTrackAsync',
            );
        }

        return track;
    }

    private getMimeType(filePath: string): string {
        return this.mimeTypes.getMimeTypeForFileExtension(this.fileAccess.getFileExtension(filePath));
    }

    private getHasLyrics(lyrics: string): number {
        if (!StringUtils.isNullOrWhiteSpace(lyrics)) {
            return 1;
        }

        return 0;
    }
}
