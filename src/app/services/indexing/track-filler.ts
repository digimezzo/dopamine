import { Injectable } from '@angular/core';
import { AlbumKeyGenerator } from '../../common/data/album-key-generator';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Logger } from '../../common/logger';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { Metadata } from '../../common/metadata/metadata';
import { MimeTypes } from '../../common/metadata/mime-types';
import { Strings } from '../../common/strings';
import { TrackFieldCreator } from './track-field-creator';

@Injectable()
export class TrackFiller {
    constructor(
        private fileMetadataFactory: FileMetadataFactory,
        private trackFieldCreator: TrackFieldCreator,
        private albumKeyGenerator: AlbumKeyGenerator,
        private fileSystem: BaseFileSystem,
        private mimeTypes: MimeTypes,
        private logger: Logger
    ) {}

    public async addFileMetadataToTrackAsync(track: Track): Promise<Track> {
        try {
            const fileMetadata: Metadata = this.fileMetadataFactory.create(track.path);
            const dateNowTicks: number = DateTime.convertDateToTicks(new Date());

            track.artists = this.trackFieldCreator.createMultiTextField(fileMetadata.artists);
            track.genres = this.trackFieldCreator.createMultiTextField(fileMetadata.genres);
            track.albumTitle = this.trackFieldCreator.createTextField(fileMetadata.album);
            track.albumArtists = this.trackFieldCreator.createMultiTextField(fileMetadata.albumArtists);
            track.albumKey = this.albumKeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);
            track.fileName = this.fileSystem.getFileName(track.path);
            track.mimeType = this.getMimeType(track.path);
            track.fileSize = await this.fileSystem.getFileSizeInBytesAsync(track.path);
            track.bitRate = this.trackFieldCreator.createNumberField(fileMetadata.bitRate);
            track.sampleRate = this.trackFieldCreator.createNumberField(fileMetadata.sampleRate);
            track.trackTitle = this.trackFieldCreator.createTextField(fileMetadata.title);
            track.trackNumber = this.trackFieldCreator.createNumberField(fileMetadata.trackNumber);
            track.trackCount = this.trackFieldCreator.createNumberField(fileMetadata.trackCount);
            track.discNumber = this.trackFieldCreator.createNumberField(fileMetadata.discNumber);
            track.discCount = this.trackFieldCreator.createNumberField(fileMetadata.discCount);
            track.duration = this.trackFieldCreator.createNumberField(fileMetadata.durationInMilliseconds);
            track.year = this.trackFieldCreator.createNumberField(fileMetadata.year);
            track.hasLyrics = this.getHasLyrics(fileMetadata.lyrics);
            track.dateAdded = dateNowTicks;
            track.dateFileCreated = await this.fileSystem.getDateCreatedInTicksAsync(track.path);
            track.dateLastSynced = dateNowTicks;
            track.dateFileModified = await this.fileSystem.getDateModifiedInTicksAsync(track.path);
            track.needsIndexing = 0;
            track.needsAlbumArtworkIndexing = 1;
            track.rating = this.trackFieldCreator.createNumberField(fileMetadata.rating);

            track.indexingSuccess = 1;
            track.indexingFailureReason = '';
        } catch (e) {
            track.indexingSuccess = 0;
            track.indexingFailureReason = e.message;

            this.logger.error(
                `Error while retrieving tag information for file ${track.path}. Error: ${e}`,
                'TrackFiller',
                'addFileMetadataToTrackAsync'
            );
        }

        return track;
    }

    private getMimeType(filePath: string): string {
        return this.mimeTypes.getMimeTypeForFileExtension(this.fileSystem.getFileExtension(filePath));
    }

    private getHasLyrics(lyrics: string): number {
        if (!Strings.isNullOrWhiteSpace(lyrics)) {
            return 1;
        }

        return 0;
    }
}
