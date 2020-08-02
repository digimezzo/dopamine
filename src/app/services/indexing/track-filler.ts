import { Injectable } from '@angular/core';
import { DateTime } from '../../core/date-time';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { AlbumkeyGenerator } from '../../data/album-key-generator';
import { DataDelimiting } from '../../data/data-delimiting';
import { Track } from '../../data/entities/track';
import { FileMetadata } from '../../metadata/file-metadata';
import { FileMetadataFactory } from '../../metadata/file-metadata-factory';
import { MetadataFixing } from '../../metadata/metadata-joining';
import { MimeTypes } from '../../metadata/mime-types';

@Injectable({
    providedIn: 'root'
})
export class TrackFiller {
    constructor(
        private fileMetadataFactory: FileMetadataFactory,
        private fileSystem: FileSystem,
        private logger: Logger) { }

    public async addFileMetadataToTrackAsync(track: Track): Promise<void> {
        try {
            const fileMetadata: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);
            const dateNowTicks: number = DateTime.getTicks(new Date());

            track.artists = this.prepareMetadataValues(fileMetadata.artists);
            track.genres = this.prepareMetadataValues(fileMetadata.genres);
            track.albumTitle = this.prepareMetadataValue(fileMetadata.album);
            track.albumArtists = this.prepareMetadataValues(fileMetadata.albumArtists);
            track.albumKey = AlbumkeyGenerator.generateAlbumKey(fileMetadata.album, fileMetadata.albumArtists);
            track.fileName = this.fileSystem.getFileName(track.path);
            track.mimeType = this.getMimeType(track.path);
            track.fileSize = this.fileSystem.getFilesizeInBytes(track.path);
            track.bitRate = fileMetadata.bitRate;
            track.sampleRate = fileMetadata.sampleRate;
            track.trackTitle = fileMetadata.title;
            track.trackNumber = fileMetadata.trackNumber;
            track.trackCount = fileMetadata.trackCount;
            track.discNumber = fileMetadata.discNumber;
            track.discCount = fileMetadata.discCount;
            track.duration = fileMetadata.duration;
            track.year = fileMetadata.year;
            track.hasLyrics = this.gethasLyrics(fileMetadata.lyrics);
            track.dateAdded = dateNowTicks;
            track.dateFileCreated = await this.fileSystem.getDateCreatedInTicksAsync(track.path);
            track.dateLastSynced = dateNowTicks;
            track.dateFileModified = await this.fileSystem.getDateModifiedInTicksAsync(track.path);
            track.needsIndexing = 0;
            track.needsAlbumArtworkIndexing = 1;
            track.rating = fileMetadata.rating;

            track.indexingSuccess = 1;
            track.indexingFailureReason = '';
        } catch (error) {
            track.indexingSuccess = 0;
            track.indexingFailureReason = error;

            this.logger.error(
                `Error while retrieving tag information for file ${track.path}. Error: ${error}`,
                'TrackFiller',
                'addFileMetadataToTrackAsync'
            );
        }
    }

    private prepareMetadataValues(valueArray: string[]): string {
        return DataDelimiting.convertToDelimitedString(
            MetadataFixing.joinUnsplittableMetadata(valueArray)
        );
    }

    private prepareMetadataValue(value: string): string {
        if (!value) {
            return '';
        }

        return value.trim();
    }

    private getMimeType(filePath: string): string {
        return MimeTypes.getMimeTypeForFileExtension(
            this.fileSystem.getFileExtension(filePath)
        );
    }

    private gethasLyrics(lyrics: string): number {
        if (lyrics && lyrics.length > 0) {
            return 1;
        }

        return 0;
    }
}
