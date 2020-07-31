import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { DataDelimiting } from '../../data/data-delimiting';
import { Track } from '../../data/entities/track';
import { FileMetadata } from '../../metadata/file-metadata';
import { FileMetadataFactory } from '../../metadata/file-metadata-factory';
import { MetadataJoining } from '../../metadata/metadata-joining';

@Injectable({
    providedIn: 'root'
})
export class TrackFiller {
    constructor(
        private fileMetadataFactory: FileMetadataFactory,
        private fileSystem: FileSystem) { }

    public async addFileMetadataToTrackAsync(track: Track): Promise<Track> {
        const fileMetadata: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);

        track.artists = DataDelimiting.convertToDelimitedString(MetadataJoining.joinUnsplittableMetadata(fileMetadata.artists));
        track.genres = DataDelimiting.convertToDelimitedString(MetadataJoining.joinUnsplittableMetadata(fileMetadata.genres));
        track.albumTitle = fileMetadata.album;
        track.albumArtists = DataDelimiting.convertToDelimitedString(MetadataJoining.joinUnsplittableMetadata(fileMetadata.albumArtists));
        track.albumKey = '';
        track.fileName = this.fileSystem.getFileName(track.path);
        track.mimeType = '';
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
        track.hasLyrics = 0;
        track.dateAdded = 0;
        track.dateFileCreated = await this.fileSystem.getDateCreatedInTicksAsync(track.path);
        track.dateLastSynced = 0;
        track.dateFileModified = await this.fileSystem.getDateModifiedInTicksAsync(track.path);
        track.needsIndexing = 0;
        track.needsAlbumArtworkIndexing = 0;
        track.indexingSuccess = 1;
        track.indexingFailureReason = '';
        track.rating = fileMetadata.rating;

        return track;
    }
}
