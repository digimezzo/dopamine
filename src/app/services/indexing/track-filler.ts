import { Injectable } from '@angular/core';
import { DateTime } from '../../core/date-time';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { StringCompare } from '../../core/string-compare';
import { AlbumKeyGenerator } from '../../data/album-key-generator';
import { Track } from '../../data/entities/track';
import { FileMetadata } from '../../metadata/file-metadata';
import { FileMetadataFactory } from '../../metadata/file-metadata-factory';
import { MimeTypes } from '../../metadata/mime-types';
import { TrackFieldCreator } from './track-field-creator';

@Injectable()
export class TrackFiller {
    constructor(
        private fileMetadataFactory: FileMetadataFactory,
        private trackFieldCreator: TrackFieldCreator,
        private albumKeygenerator: AlbumKeyGenerator,
        private fileSystem: FileSystem,
        private mimeTypes: MimeTypes,
        private logger: Logger
    ) {}

    public async addFileMetadataToTrackAsync(track: Track): Promise<Track> {
        try {
            const fileMetadata: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);
            const dateNowTicks: number = DateTime.convertDateToTicks(new Date());

            // Store duration in milliseconds, for compatibility with Dopamine 2 database.
            const durationInMilliseconds: number = fileMetadata.durationInSeconds * 1000;

            track.artists = this.trackFieldCreator.createMultiTextField(fileMetadata.artists);
            track.genres = this.trackFieldCreator.createMultiTextField(fileMetadata.genres);
            track.albumTitle = this.trackFieldCreator.createTextField(fileMetadata.album);
            track.albumArtists = this.trackFieldCreator.createMultiTextField(fileMetadata.albumArtists);
            track.albumKey = this.albumKeygenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);
            track.fileName = this.fileSystem.getFileName(track.path);
            track.mimeType = this.getMimeType(track.path);
            track.fileSize = await this.fileSystem.getFilesizeInBytesAsync(track.path);
            track.bitRate = this.trackFieldCreator.createNumberField(fileMetadata.bitRate);
            track.sampleRate = this.trackFieldCreator.createNumberField(fileMetadata.sampleRate);
            track.trackTitle = this.trackFieldCreator.createTextField(fileMetadata.title);
            track.trackNumber = this.trackFieldCreator.createNumberField(fileMetadata.trackNumber);
            track.trackCount = this.trackFieldCreator.createNumberField(fileMetadata.trackCount);
            track.discNumber = this.trackFieldCreator.createNumberField(fileMetadata.discNumber);
            track.discCount = this.trackFieldCreator.createNumberField(fileMetadata.discCount);
            track.duration = this.trackFieldCreator.createNumberField(durationInMilliseconds);
            track.year = this.trackFieldCreator.createNumberField(fileMetadata.year);
            track.hasLyrics = this.gethasLyrics(fileMetadata.lyrics);
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
                `Error while retrieving tag information for file ${track.path}. Error: ${e.message}`,
                'TrackFiller',
                'addFileMetadataToTrackAsync'
            );
        }

        return track;
    }

    private getMimeType(filePath: string): string {
        return this.mimeTypes.getMimeTypeForFileExtension(this.fileSystem.getFileExtension(filePath));
    }

    private gethasLyrics(lyrics: string): number {
        if (!StringCompare.isNullOrWhiteSpace(lyrics)) {
            return 1;
        }

        return 0;
    }
}
